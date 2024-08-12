import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import SubscribeButton from "@/app/dashboard/billing/SubscribeButton";
import { NextResponse } from "next/server";
import { auth } from "firebase-admin";
import ManageSubscription from "./ManageSubscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = cookies().get("session")?.value || "";

  if (!session) {
    redirect("/login");
    return NextResponse.json({ isLogged: false }, { status: 401 });
  }

  const decodedClaims = await auth().verifySessionCookie(session, true);
  const uid = decodedClaims;

  //@ts-ignore
  const { isPro, isCanceled, currentPeriodEnd, updatePaymentMethodURL } =
    await getUserSubscriptionPlan();

  console.log(isPro, isCanceled, currentPeriodEnd, updatePaymentMethodURL);

  return (
    <div className="p-5 mt-5">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="font-heading text-3xl md:text-4xl">Billing</h1>
          <p className="text-lg text-muted-foreground">
            Manage billing and your subscription plan.
          </p>
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <span className="font-semibold">{isPro ? "Pro" : "Basic"}</span> plan.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
          {isPro ? (
            <ManageSubscription
              userId={uid.uid}
              isCanceled={isCanceled}
              currentPeriodEnd={currentPeriodEnd}
              updatePaymentMethodURL={updatePaymentMethodURL}
            />
          ) : (
            <SubscribeButton />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
