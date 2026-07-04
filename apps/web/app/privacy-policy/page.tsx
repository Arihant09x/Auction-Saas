import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#FCFCFC] font-['Poppins']">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <h1 className="text-4xl font-extrabold text-[#012972] mb-8 font-epilogue">Privacy Policy</h1>
                <div className="space-y-6 text-[#012972]/80 leading-relaxed text-[15px]">
                    <p>
                        {"At Auction11, we are committed to protecting your privacy and handling your personal information with care, transparency, and integrity. This Privacy Policy explains how we collect, use, store, and disclose information when you use our Services available at https://www.auction11.live."}
                    </p>
                    <p>
                        {"By accessing or using our Services, you agree to the practices described in this Privacy Policy. If you do not agree with any part of this policy, please discontinue your use of our Services."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">1. Interpretation and Definitions</h2>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">1.1 Interpretation</h3>
                    <p>
                        {"Words with an initial capital letter have specific meanings as defined below. These definitions apply regardless of whether they appear in singular or plural form."}
                    </p>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">1.2 Definitions</h3>
                    <p>{"For the purposes of this Privacy Policy:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>{"Affiliate "}</strong>{"refers to any entity that controls, is controlled by, or is under common control with a party, where \"control\" means ownership of 50% or more of voting shares or equivalent authority."}
                        </li>
                        <li>
                            <strong>{"Application "}</strong>{"refers to Auction11, the digital platform and services provided by the Company."}
                        </li>
                        <li>
                            <strong>{"Company "}</strong>{"(referred to as \"we,\" \"us,\" or \"our\") refers to Auction11, an individual business operating from Belagavi, Karnataka, India."}
                        </li>
                        <li>
                            <strong>{"Device "}</strong>{"refers to any device capable of accessing the Service, including computers, smartphones, and tablets."}
                        </li>
                        <li>
                            <strong>{"Personal Data "}</strong>{"refers to any information that relates to an identified or identifiable individual."}
                        </li>
                        <li>
                            <strong>{"Service "}</strong>{"refers to the Auction11 platform and all related digital services."}
                        </li>
                        <li>
                            <strong>{"Service Provider "}</strong>{"refers to any third-party individual or organisation that processes data on behalf of the Company to support the delivery or improvement of the Service."}
                        </li>
                        <li>
                            <strong>{"Usage Data "}</strong>{"refers to data collected automatically through interaction with the Service, such as pages visited, time spent, and device information."}
                        </li>
                        <li>
                            <strong>{"You "}</strong>{"refers to the individual accessing or using the Service, or the legal entity on whose behalf such individual acts."}
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">2. Information We Collect</h2>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">2.1 Personal Data</h3>
                    <p>
                        {"When you register or use our Services, we may collect personally identifiable information including:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Full name"}</li>
                        <li>{"Email address"}</li>
                        <li>{"Phone number"}</li>
                        <li>{"Profile image"}</li>
                    </ul>
                    <p>
                        {"This information is provided voluntarily by you during registration or while using certain features of the platform."}
                    </p>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">2.2 Usage Data</h3>
                    <p>
                        {"We automatically collect Usage Data when you interact with the Services. This may include:"}
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Your device's IP address"}</li>
                        <li>{"Browser type and version"}</li>
                        <li>{"Pages visited and time of visit"}</li>
                        <li>{"Time spent on individual pages"}</li>
                        <li>{"Unique device identifiers and diagnostic information"}</li>
                    </ul>
                    <p>
                        {"If you access the Service via a mobile device, we may additionally collect information about your mobile operating system, unique device ID, and mobile browser type."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">3. How We Use Your Information</h2>
                    <p>{"We use the information we collect for the following purposes:"}</p>
                    <ol className="list-decimal pl-6 space-y-2">
                        <li>{"To provide, operate, and maintain our Services."}</li>
                        <li>{"To manage your account and grant you access to Service features."}</li>
                        <li>{"To fulfil contractual obligations, including processing auction service requests."}</li>
                        <li>{"To communicate with you via email, SMS, or push notifications regarding your account, updates, and service-related matters."}</li>
                        <li>{"To send you promotional offers, news, or updates relevant to our Services (where you have not opted out)."}</li>
                        <li>{"To respond to your queries and support requests."}</li>
                        <li>{"To analyse usage trends and improve our platform, features, and user experience."}</li>
                        <li>{"To evaluate potential business transactions such as mergers, acquisitions, or asset transfers."}</li>
                    </ol>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">4. Sharing Your Information</h2>
                    <p>{"We do not sell your personal information. We may share your data in the following circumstances:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"With Service Providers who assist us in operating, analysing, and improving our Services — subject to confidentiality obligations."}</li>
                        <li>{"In connection with a business transfer, merger, acquisition, or sale of assets, provided you are notified in advance."}</li>
                        <li>{"With affiliates or business partners who assist in delivering offerings to you — subject to this Privacy Policy."}</li>
                        <li>{"When legally required, such as in response to a valid court order, government authority, or applicable law."}</li>
                        <li>{"With your explicit consent for any other purpose."}</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">5. Data Retention</h2>
                    <p>
                        {"We retain your Personal Data only for as long as necessary to fulfil the purposes described in this Privacy Policy, or as required by applicable Indian law. Usage Data is typically retained for shorter durations unless required for security improvements or legal compliance. When your data is no longer necessary, we will securely delete or anonymise it."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">6. Transfer of Your Personal Data</h2>
                    <p>
                        {"Your personal information may be processed and stored on servers located outside your state or country. By using our Services and providing us with your information, you consent to such transfers, provided that adequate data protection safeguards are in place."}
                    </p>
                    <p>
                        {"We will take all reasonably necessary steps to ensure that your data is treated securely and in accordance with this Privacy Policy."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">7. Your Data Rights</h2>
                    <p>{"You have the following rights with respect to your personal data:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Right to access the personal data we hold about you."}</li>
                        <li>{"Right to correct or update inaccurate information."}</li>
                        <li>{"Right to request deletion of your personal data, subject to legal obligations."}</li>
                        <li>{"Right to withdraw consent for data processing where consent is the basis for processing."}</li>
                    </ul>
                    <p>
                        {"To exercise these rights, you may sign in to your account and manage your preferences, or contact us at auction11.live@gmail.com."}
                    </p>
                    <p>
                        {"Please note that certain data may need to be retained by us to comply with legal obligations, even upon deletion request."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">8. Disclosure of Personal Data</h2>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">8.1 Business Transactions</h3>
                    <p>
                        {"If Auction11 undergoes a merger, acquisition, or asset sale, your Personal Data may be transferred to the acquiring entity. We will notify you before such a transfer and the applicable privacy policy changes take effect."}
                    </p>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">8.2 Legal Requirements</h3>
                    <p>
                        {"We may disclose your Personal Data if required to do so by law or in response to valid requests from public authorities (e.g., courts or government agencies)."}
                    </p>
                    <h3 className="text-xl font-bold text-[#012972] mt-4 mb-2">8.3 Other Legal Grounds</h3>
                    <p>{"We may also disclose your data in good faith when we believe it is necessary to:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Comply with a legal obligation."}</li>
                        <li>{"Protect and defend the rights or property of Auction11."}</li>
                        <li>{"Investigate or prevent possible wrongdoing in connection with our Services."}</li>
                        <li>{"Protect the personal safety of users or the general public."}</li>
                        <li>{"Mitigate legal liability."}</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">9. Security of Your Data</h2>
                    <p>
                        {"We take the security of your personal information seriously and implement commercially reasonable technical and organisational measures to protect it. However, no method of transmission over the internet or electronic storage is entirely secure."}
                    </p>
                    <p>
                        {"While we strive to use industry-standard safeguards, we cannot guarantee absolute security and encourage you to use strong, unique passwords and to contact us immediately if you suspect any unauthorised access to your account."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">10. Children's Privacy</h2>
                    <p>
                        {"Our Services are not directed at individuals under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data without your consent, please contact us at auction11.live@gmail.com and we will promptly delete such information from our records."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">11. Third-Party Links</h2>
                    <p>
                        {"Our platform may contain links to third-party websites or services. These sites are governed by their own privacy policies, and we strongly encourage you to review them before providing any personal information. We are not responsible for the content or privacy practices of any third-party websites."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">12. Changes to This Privacy Policy</h2>
                    <p>{"We may revise this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform updates. When we make material changes, we will:"}</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>{"Post the updated policy on this page."}</li>
                        <li>{"Notify you via email and/or a prominent notice on the platform."}</li>
                        <li>{"Update the \"Last Updated\" date at the top of this policy."}</li>
                    </ul>
                    <p>
                        {"Your continued use of the Services after such changes constitutes your acceptance of the revised Privacy Policy."}
                    </p>

                    <h2 className="text-2xl font-bold text-[#012972] mt-8 mb-4">13. Contact Us</h2>
                    <p>{"If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:"}</p>
                    <p className="mt-2">
                        <strong>{"Auction11"}</strong><br />
                        {"Email: auction11.live@gmail.com"}<br />
                        {"Website: https://www.auction11.live"}<br />
                        {"Location: Karnataka, India"}
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
