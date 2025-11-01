import { FormBuilderWithCustomization } from "@/components/surveys/form-builder-with-customization";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function NewSurveyPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  // Obtener el plan del tenant
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  const userPlan = tenant?.plan || "free";

  return <FormBuilderWithCustomization mode="create" userPlan={userPlan} />;
}
