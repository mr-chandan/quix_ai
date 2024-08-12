"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CreateCheckoutResponse } from "@/app/api/payment/subscribe/route";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/Icons";

export default function SubscribeButton() {
  const [user, setUser] = useState<User | null>(null);
  const [checkoutURL, setCheckoutURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        console.log("No user is currently authenticated");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);

  if (!user) return <></>;

  const handleClick = async () => {
    setLoading(true);
    try {
      if (user) {
        try {
          const response = await axios.post<any, CreateCheckoutResponse>(
            "/api/payment/subscribe",
            { userId: user.uid }
          );

          setCheckoutURL(response.data.checkoutURL);

          if (response.data.checkoutURL) {
            window.LemonSqueezy.Url.Open(response.data.checkoutURL);
          }
        } catch (err) {
          console.error("Failed to get checkout URL:", err);
          toast({
            title: "Something went wrong",
            description: "Try logging in again or refresh the page",
          });
        }
      } else {
        toast({
          title: "Something went wrong",
          description: "Try logging in again or refresh the page",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to buy subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} className="w-full" disabled={loading}>
      {loading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
      Subscribe to Pro plan
    </Button>
  );
}
