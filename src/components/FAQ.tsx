
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I get started with buying a property?",
      answer: "Start by getting pre-approved for a mortgage, then browse our listings or contact our team for a consultation. We'll help you understand your budget and find properties that match your criteria."
    },
    {
      question: "What documents do I need to buy a property?",
      answer: "You'll typically need proof of income, bank statements, credit report, employment verification, and a down payment. Our team will provide a complete checklist based on your specific situation."
    },
    {
      question: "How long does the buying process take?",
      answer: "The typical buying process takes 30-45 days from offer acceptance to closing, though this can vary based on financing, inspections, and other factors."
    },
    {
      question: "Do you help with property management?",
      answer: "Yes, we offer comprehensive property management services including tenant screening, rent collection, maintenance coordination, and property inspections."
    },
    {
      question: "What are your commission rates?",
      answer: "Our commission rates are competitive and depend on the specific services required. We offer transparent pricing and will discuss all fees upfront during your consultation."
    },
    {
      question: "Can you help with commercial properties?",
      answer: "Absolutely! We have extensive experience in commercial real estate including office buildings, retail spaces, warehouses, and investment properties."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get answers to the most common questions about our services and the real estate process
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
