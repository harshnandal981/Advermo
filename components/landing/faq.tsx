"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "How does Advermo work?",
    answer: "Advermo connects brands looking for advertising spaces with venue owners who have ad inventory. Brands browse, book, and launch campaigns in minutes.",
  },
  {
    question: "How do I list my venue?",
    answer: "Sign up as a venue owner, complete your profile, add your ad spaces with photos and details, and start receiving booking requests!",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major payment methods via Razorpay including UPI, credit/debit cards, net banking, and digital wallets.",
  },
  {
    question: "Is there a minimum booking period?",
    answer: "Minimum booking period varies by space, typically 1-3 months. Check individual space listings for details.",
  },
  {
    question: "How do refunds work?",
    answer: "Full refund if cancelled 7+ days before start date. 50% refund if 3-7 days before. No refund within 3 days of start date.",
  },
  {
    question: "Do I need to sign a contract?",
    answer: "All bookings are governed by our standard terms. For long-term or enterprise bookings, custom contracts are available.",
  },
  {
    question: "How quickly can I launch a campaign?",
    answer: "Once your booking is confirmed and payment is completed, your campaign can go live immediately or on your chosen start date.",
  },
  {
    question: "What makes Advermo different?",
    answer: "We offer verified venues, instant booking, secure payments, real-time analytics, and exceptional customer support all in one platform.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Advermo
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-lg bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold pr-8">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
