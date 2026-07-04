import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";


export default function ShippingAndDeliveryPage() {
    return (
        <main className="min-h-screen bg-[#FCFCFC] font-['Poppins']">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-4xl font-extrabold text-[#012972] mb-8 font-epilogue">Shipping & Delivery Policy</h1>
                <div className="space-y-6 text-[#012972]/80 leading-relaxed text-[15px]">
                    <p>
                        Auction11 is a fully digital platform that delivers online cricket auction services. We do not manufacture, stock, or ship any physical products. This Shipping & Delivery Policy outlines how we fulfil service orders, manage digital delivery, and address related queries. By placing an order on our platform, you acknowledge and agree to the terms described in this policy.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">1. Nature of Services</h2>
                    <p>
                        All products and services offered by Auction11 are digital in nature. Upon successful purchase, you will receive access to the relevant features or service packages within the Auction11 application. No physical delivery is required or applicable.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">2. Order Confirmation and Fulfilment</h2>
                    <p>Upon completing a purchase, you will receive:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>A confirmation email containing your order details, selected service package, and access instructions.</li>
                        <li>Access to your purchased auction service through the Auction11 application, based on the package chosen.</li>
                        <li>The ability to track the progress of your auction in real-time directly through the platform.</li>
                    </ul>
                    <p>
                        If you do not receive a confirmation email within a reasonable time after placing your order, please check your spam or junk folder, or contact our support team at [auction11.live@gmail.com](mailto:auction11.live@gmail.com).
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">3. Digital Access and Delivery</h2>
                    <p>
                        Access to purchased services is typically granted immediately or within a short period following confirmation of your payment. The specific service features available to you will depend on your chosen service package. In the event of technical issues or delays in service activation, our team will work diligently to resolve the matter and ensure prompt access.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">4. Service Cancellations by Auction11</h2>
                    <p>
                        We reserve the right to cancel your order if we are unable to provide the requested service due to technical limitations, platform incompatibility, or other operational constraints. In such cases, you will be entitled to a full refund of any amount paid. We will notify you promptly via email in the event that your order is cancelled by us, along with the reason for cancellation and refund timelines.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">5. Refunds</h2>
                    <p>
                        For details regarding refund eligibility and the process for requesting a refund, please refer to our Cancellation & Refund Policy, available on our website. Refund decisions are subject to the conditions outlined therein.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">6. Changes to This Policy</h2>
                    <p>
                        Auction11 reserves the right to update or modify this Shipping & Delivery Policy at any time. In the event of significant changes, we will notify you via email and update this page accordingly. Your continued use of the Services following such changes indicates your acceptance of the revised policy.
                    </p>


                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">7. Contact Us</h2>
                    <p>If you have any questions regarding your order, service delivery, or this policy, please get in touch with us:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Auction11</li>
                        <li>Email: [auction11.live@gmail.com](mailto:auction11.live@gmail.com)</li>
                        <li>Website: [https://www.auction11.live](https://www.auction11.live)</li>
                        <li>Location: Karnataka, India</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}