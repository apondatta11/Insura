import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What types of insurance do you offer?",
      answer: "We offer a comprehensive range of insurance products including auto, home, life, health, and business insurance to meet all your protection needs."
    },
    {
      question: "How can I get a quote?",
      answer: "You can get a free quote by using our online quote tool, calling our agents directly, or visiting one of our local offices. The process takes just a few minutes."
    },
    {
      question: "What payment options do you accept?",
      answer: "We accept various payment methods including credit/debit cards, bank transfers, and online payment platforms. You can also set up automatic payments for convenience."
    },
    {
      question: "How do I file a claim?",
      answer: "You can file a claim through our online portal, mobile app, or by contacting your agent directly. We recommend filing as soon as possible after an incident occurs."
    },
    {
      question: "Can I update my policy coverage?",
      answer: "Yes, you can update your policy coverage at any time by contacting your agent or through your online account. Changes typically take effect immediately or within 24 hours."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find quick answers to common questions about our insurance services and policies.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-lg"
              >
                <span className="font-semibold text-foreground text-lg">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <span className="text-primary hover:underline font-semibold">
              Contact our support team at 0167894321
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;