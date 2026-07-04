import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-[#FCFCFC] font-['Poppins']">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-4xl font-extrabold text-[#012972] mb-8 font-epilogue">Cancellation & Refund Policy</h1>
                <div className="space-y-6 text-[#012972]/80 leading-relaxed text-[15px]">
                    <p>
                        Thank you for choosing Auction11. We are committed to providing a seamless and reliable auction experience. Please read this Cancellation & Refund Policy carefully before placing an order or subscribing to any of our Services. By using our Services and completing a purchase, you acknowledge and agree to the terms outlined in this policy.
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">1. Interpretation and Definitions</h2>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">1.1 Interpretation</h3>
                    <p>
                        Capitalised terms used in this policy carry the meanings defined below and shall have the same interpretation whether they appear in singular or plural form.
                    </p>

                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">1.2 Definitions</h3>
                    <p>
                        {"Company (referred to as \"we\", \"us\", or \"our\") refers to Auction11, an individual business operating from Belagavi, Karnataka, India."}
                    </p>
                    <p>
                        {"Order means a request placed by you to purchase or access any service offered by Auction11."}
                    </p>
                    <p>
                        {"You refers to the individual accessing, using, or placing an Order through our platform."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">2. Order Cancellation Policy</h2>
                    <p>
                        {"Once a service Order has been successfully placed and confirmed through the Auction11 platform, it is considered binding. As our Services are digital and delivered upon confirmation, orders generally cannot be cancelled once placed."}
                    </p>
                    <p>
                        {"We strongly recommend that you review your selected service package carefully before confirming your purchase."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">3. Eligibility for Refund</h2>
                    <p>
                        {"While orders are non-cancellable by default, we recognise that exceptional circumstances may arise. A refund may be considered under the following conditions only:"}
                    </p>

                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">Condition 1: Non-Delivery of Services</h3>
                    <p>
                        {"If Auction11 is unable to deliver the purchased service within the timeframe specified in the Auction11 application, you will be eligible for a full refund of the amount paid."}
                    </p>

                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">Condition 2: Genuine Dispute</h3>
                    <p>
                        {"If you have a genuine, verifiable reason for requesting a refund that does not fall within Condition 1, you may submit a refund request to our support team at auction11.live@gmail.com. Our team will conduct a thorough review of the circumstances and provide a final decision within a reasonable timeframe."}
                    </p>
                    <p>
                        {"Auction11 reserves the right to approve or decline refund requests based on the outcome of its investigation. All decisions made by Auction11 in this regard shall be considered final."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">4. How to Request a Refund</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{`Send an email to auction11.live@gmail.com with the subject line: "Refund Request – [Your Order ID]"`}</li>
                        <li>{"Include your registered name, email address, order details, and a clear explanation of your reason for requesting a refund."}
                        </li>
                        <li>{"Our support team will acknowledge your request within 2–3 business days and communicate the outcome to you."}
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">5. Refund Processing</h2>
                    <p>
                        {"Approved refunds will be processed to the original payment method used at the time of purchase. Processing time may vary depending on your bank or payment provider, but typically takes 5–10 business days from the date of approval."}
                    </p>
                    <p>
                        {"Auction11 does not bear responsibility for any delays caused by third-party payment processors or financial institutions."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">6. Non-Refundable Circumstances</h2>
                    <p>{"Refunds will not be issued in the following situations:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"The service was delivered as described and within the specified timeframe."}
                        </li>
                        <li>{"You changed your mind after the Order was placed and services commenced."}
                        </li>
                        <li>{"The refund request is based on subjective preferences unrelated to service quality or delivery."}
                        </li>
                        <li>{"The request is made after the service has been fully consumed or the auction event has concluded."}
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">7. Modifications to This Policy</h2>
                    <p>
                        {"Auction11 reserves the right to revise this Cancellation & Refund Policy at any time. Any changes will be posted on our website, and where significant, we will notify you by email. Your continued use of the Services following such changes constitutes your acceptance of the revised policy."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">8. Contact Us</h2>
                    <p>{"For any questions or concerns related to cancellations, refunds, or this policy, please reach out to us:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Auction11"}</li>
                        <li>{"Email: auction11.live@gmail.com"}</li>
                        <li>{"Website: https://www.auction11.live"}</li>
                        <li>{"Location: Karnataka, India"}</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}


