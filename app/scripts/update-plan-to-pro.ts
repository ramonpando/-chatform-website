import { db } from '../src/lib/db';
import { tenants, users, tenantUsers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function updateToPro() {
  try {
    // Buscar el usuario por email
    const user = await db.query.users.findFirst({
      where: eq(users.email, 'ramonpandor@gmail.com'),
    });

    if (!user) {
      console.error('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:', user.email);

    // Buscar la relación tenant-user
    const tenantUser = await db.query.tenantUsers.findFirst({
      where: eq(tenantUsers.userId, user.id),
    });

    if (!tenantUser) {
      console.error('❌ Relación tenant-user no encontrada');
      return;
    }

    console.log('✅ Tenant ID:', tenantUser.tenantId);

    // Actualizar el tenant a plan Pro
    const updatedTenant = await db
      .update(tenants)
      .set({
        plan: 'pro',
        responsesLimit: 10000,
        surveysLimit: 50,
        subscriptionStatus: 'active',
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, tenantUser.tenantId))
      .returning();

    console.log('✅ Plan actualizado a PRO:', updatedTenant[0]);
    console.log('\n📋 Detalles:');
    console.log('  Plan:', updatedTenant[0].plan);
    console.log('  Respuestas:', updatedTenant[0].responsesLimit);
    console.log('  Encuestas:', updatedTenant[0].surveysLimit);
    console.log('  Estado:', updatedTenant[0].subscriptionStatus);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateToPro();
