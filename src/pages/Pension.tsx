
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Pension() {
  return (
    <div>
      <Header />
      <main className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary/10 min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 rounded-xl shadow-lg border-2 border-primary mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Pension & Retirement Planning</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Secure your future with expert pension solutions tailored for individuals, families, and businesses. Our pension advisory services help you plan, invest, and manage your retirement with confidence.
            </p>
            <ul className="list-disc ml-6 mb-6 text-base text-muted-foreground">
              <li>Personal Pension Plans</li>
              <li>Group & Corporate Pension Schemes</li>
              <li>Retirement Income Strategies</li>
              <li>Tax-Efficient Savings & Withdrawals</li>
              <li>Investment Portfolio Management</li>
              <li>Risk Assessment & Longevity Planning</li>
              <li>Regulatory Compliance & Reporting</li>
            </ul>
            <div className="bg-primary/10 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-primary mb-2">Why Choose Galloways?</h2>
              <ul className="list-disc ml-6 text-base">
                <li>14+ years of pension advisory experience</li>
                <li>Independent, unbiased recommendations</li>
                <li>Access to top-rated pension providers</li>
                <li>Personalized retirement planning for every stage of life</li>
                <li>Transparent fees & ongoing support</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="px-8 py-3 bg-gold text-primary font-bold">Request Pension Consultation</Button>
              <Button variant="outline" size="lg" className="px-8 py-3">Download Pension Brochure</Button>
            </div>
          </Card>
          <Card className="p-6 rounded-xl shadow border mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">How Our Pension Process Works</h2>
            <ol className="list-decimal ml-6 text-base text-muted-foreground mb-4">
              <li>Initial Consultation & Needs Assessment</li>
              <li>Customized Pension Plan Design</li>
              <li>Provider Selection & Application Support</li>
              <li>Ongoing Portfolio Monitoring & Adjustments</li>
              <li>Retirement Income Optimization</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              We work with you every step of the way to ensure your retirement goals are met and your financial future is secure.
            </p>
          </Card>
          <Card className="p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold text-primary mb-2">Frequently Asked Questions</h2>
            <ul className="list-disc ml-6 text-base text-muted-foreground">
              <li><strong>What is a personal pension plan?</strong> <br />A personal pension plan is a long-term savings product designed to help you build a retirement fund, with flexible contributions and investment options.</li>
              <li><strong>Can I transfer my existing pension?</strong> <br />Yes, we can help you review, transfer, or consolidate your pension funds for better performance and lower fees.</li>
              <li><strong>How much should I save for retirement?</strong> <br />Our advisors will help you calculate your retirement needs based on your lifestyle, goals, and expected expenses.</li>
              <li><strong>What happens if I change jobs?</strong> <br />We provide guidance on managing your pension benefits during career transitions.</li>
              <li><strong>Are there tax benefits?</strong> <br />Pension contributions may be eligible for tax relief. We help you maximize your tax efficiency.</li>
            </ul>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
