import dotenv from 'dotenv'
import {
  PrismaClient,
  Role,
  UserStatus,
  Difficulty,
  MealType,
  MembershipStatus,
  PaymentStatus,
  PaymentMethod,
  NotificationType,
} from '@prisma/client'
import bcrypt from 'bcrypt'
import { PERMISSIONS } from '../constants/permissions.js'

dotenv.config({ override: true })

const prisma = new PrismaClient()

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('Password123!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gym.com' },
    update: {
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      passwordHash,
    },
    create: {
      email: 'admin@gym.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.SUPER_ADMIN,
      isVerified: true,
      profile: { create: {} },
      settings: { create: {} },
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'demo@gym.com' },
    update: {},
    create: {
      email: 'demo@gym.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Member',
      role: Role.USER,
      isVerified: true,
      profile: {
        create: {
          age: 28,
          weight: 75,
          height: 178,
          fitnessGoal: 'BUILD_MUSCLE',
          activityLevel: 'MODERATELY_ACTIVE',
        },
      },
      settings: { create: {} },
    },
  })

  const membershipPlans = [
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Access to basic programs and community features.',
      price: 49,
      features: ['Basic Programs', 'Standard App Features', 'Community Forum'],
      sortOrder: 1,
    },
    {
      name: 'Pro Performance',
      slug: 'pro-performance',
      description: 'AI-adaptive training with full nutrition engine.',
      price: 89,
      features: [
        'AI-Adaptive Training',
        'Full Nutrition Engine',
        '1 Monthly Trainer Sync',
        'Smart Wearable Integration',
      ],
      sortOrder: 2,
    },
    {
      name: 'Elite Coaching',
      slug: 'elite-coaching',
      description: '24/7 coach access with biometric reviews.',
      price: 199,
      features: [
        '24/7 Coach WhatsApp',
        'Monthly Biometric Review',
        'Custom Competition Prep',
      ],
      sortOrder: 3,
    },
  ]

  const createdPlans = []
  for (const plan of membershipPlans) {
    const created = await prisma.membershipPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    })
    createdPlans.push(created)
  }

  const proPlan = createdPlans.find((p) => p.slug === 'pro-performance')!

  const existingMembership = await prisma.userMembership.findFirst({
    where: { userId: user.id, planId: proPlan.id },
  })

  if (!existingMembership) {
    const membership = await prisma.userMembership.create({
      data: {
        userId: user.id,
        planId: proPlan.id,
        status: MembershipStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.payment.create({
      data: {
        userId: user.id,
        membershipId: membership.id,
        amount: proPlan.price,
        status: PaymentStatus.COMPLETED,
        method: PaymentMethod.CARD,
        paidAt: new Date(),
      },
    })
  }

  const categories = [
    { name: 'Strength', slug: 'strength', icon: 'dumbbell' },
    { name: 'HIIT', slug: 'hiit', icon: 'flame' },
    { name: 'Yoga', slug: 'yoga', icon: 'heart' },
    { name: 'Cardio', slug: 'cardio', icon: 'activity' },
  ]

  for (const category of categories) {
    const createdCategory = await prisma.workoutCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })

    const exercise = await prisma.exercise.upsert({
      where: { slug: `${category.slug}-foundation` },
      update: {},
      create: {
        categoryId: createdCategory.id,
        name: `${category.name} Foundation`,
        slug: `${category.slug}-foundation`,
        description: `Core ${category.name.toLowerCase()} movement patterns.`,
        difficulty: Difficulty.BEGINNER,
        muscles: ['full body'],
        equipment: ['mat'],
      },
    })

    const plan = await prisma.workoutPlan.upsert({
      where: { slug: `${category.slug}-starter` },
      update: {},
      create: {
        categoryId: createdCategory.id,
        title: `${category.name} Starter`,
        slug: `${category.slug}-starter`,
        description: `A beginner-friendly ${category.name.toLowerCase()} workout.`,
        duration: 30,
        difficulty: Difficulty.BEGINNER,
        calories: 250,
      },
    })

    await prisma.workoutPlanExercise.upsert({
      where: {
        workoutPlanId_exerciseId: {
          workoutPlanId: plan.id,
          exerciseId: exercise.id,
        },
      },
      update: {},
      create: {
        workoutPlanId: plan.id,
        exerciseId: exercise.id,
        order: 1,
        sets: 3,
        reps: 12,
        restSec: 60,
      },
    })
  }

  const mealPlans = [
    {
      name: 'Power Breakfast Bowl',
      calories: 520,
      protein: 35,
      carbs: 48,
      fat: 18,
      mealType: MealType.BREAKFAST,
    },
    {
      name: 'Lean Lunch Plate',
      calories: 610,
      protein: 42,
      carbs: 55,
      fat: 20,
      mealType: MealType.LUNCH,
    },
    {
      name: 'Recovery Dinner',
      calories: 580,
      protein: 40,
      carbs: 42,
      fat: 22,
      mealType: MealType.DINNER,
    },
  ]

  for (const plan of mealPlans) {
    const existing = await prisma.mealPlan.findFirst({ where: { name: plan.name } })
    if (!existing) {
      await prisma.mealPlan.create({ data: plan })
    }
  }

  const strengthPlan = await prisma.workoutPlan.findUnique({
    where: { slug: 'strength-starter' },
  })

  if (strengthPlan) {
    const existingHistory = await prisma.workoutHistory.findFirst({
      where: { userId: user.id, workoutPlanId: strengthPlan.id },
    })
    if (!existingHistory) {
      await prisma.workoutHistory.create({
        data: {
          userId: user.id,
          workoutPlanId: strengthPlan.id,
          duration: 28,
          calories: 240,
        },
      })
    }

    await prisma.favoriteWorkout.upsert({
      where: {
        userId_workoutPlanId: {
          userId: user.id,
          workoutPlanId: strengthPlan.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        workoutPlanId: strengthPlan.id,
      },
    })
  }

  const bmi = 75 / (1.78 * 1.78)
  const existingBmi = await prisma.bMIHistory.findFirst({ where: { userId: user.id } })
  if (!existingBmi) {
    await prisma.bMIHistory.create({
      data: {
        userId: user.id,
        bmi: Math.round(bmi * 10) / 10,
        weight: 75,
        height: 178,
        category: 'Healthy',
      },
    })
  }

  const existingProgress = await prisma.progressTracking.findFirst({
    where: { userId: user.id },
  })
  if (!existingProgress) {
    await prisma.progressTracking.create({
      data: {
        userId: user.id,
        weight: 75,
        waterIntakeMl: 2500,
        caloriesBurned: 620,
        caloriesConsumed: 2100,
        steps: 8500,
      },
    })
  }

  const existingNotification = await prisma.notification.findFirst({
    where: { userId: user.id },
  })
  if (!existingNotification) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to Elite Performance',
        message: 'Your Pro Performance membership is active. Start your first workout!',
        type: NotificationType.MEMBERSHIP,
        link: '/dashboard',
      },
    })
  }

  for (const permission of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        name: permission.name,
        module: permission.module,
      },
      create: {
        key: permission.key,
        name: permission.name,
        module: permission.module,
      },
    })

    for (const role of [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER]) {
      await prisma.rolePermission.upsert({
        where: {
          role_permissionId: {
            role,
            permissionId: record.id,
          },
        },
        update: {},
        create: {
          role,
          permissionId: record.id,
        },
      })
    }
  }

  console.log('Seed completed successfully.')
  console.log('')
  console.log('  Demo user:  demo@gym.com / Password123!')
  console.log('  Admin user: admin@gym.com / Password123!')
  console.log(`  Admin ID: ${admin.id}`)
  console.log(`  Demo ID:  ${user.id}`)
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
