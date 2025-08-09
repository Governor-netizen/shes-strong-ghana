import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Heart, Shield, AlertTriangle, CheckCircle, ExternalLink, Clock, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
const educationalContent = {
  "risk-factors": [{
    id: 1,
    title: "Understanding Triple-Negative Breast Cancer",
    description: "Learn about this aggressive form of breast cancer and why early detection is crucial",
    readTime: "5 min read",
    category: "Basics",
    content: "Triple-Negative Breast Cancer (TNBC) is one of the most aggressive forms—fast-growing, harder to treat, and more common in younger women and those of African ancestry. TNBC does not respond to hormone therapies, so chemotherapy is often the mainstay. There is hope: newer targeted options like PARP inhibitors and immunotherapy show benefit, especially for people with BRCA mutations. Early detection, knowing your risk, and staying informed can make a real difference. Based on “An Overview of Triple‑Negative Breast Cancer” by Pankaj Kumar & Rupali Aggarwal.",
    tags: ["TNBC", "Basics", "Detection"]
  }, {
    id: 2,
    title: "Genetic Risk Factors in Ghanaian Women",
    description: "Exploring hereditary factors and family history patterns specific to Ghanaian populations",
    readTime: "7 min read",
    category: "Genetics",
    content: "Women of African ancestry—especially Ghanaian women—face a disproportionately high risk of triple‑negative breast cancer (TNBC). A landmark analysis found 82% of Ghanaian breast cancer cases were TNBC, versus 26% in African Americans and 16% in white Americans. Ghanaian women were diagnosed younger (average age ~48) and with more aggressive tumors (76% grade 3). These patterns point to genetic contributors beyond socioeconomic factors and underline the need for targeted research, earlier detection, and broader access to genetic testing. Based on “African Ancestry and Higher Prevalence of Triple‑Negative Breast Cancer” by Azadeh Stark et al., Cancer (2010).",
    tags: ["Genetics", "Family History", "Ghana"]
  }, {
    id: 3,
    title: "Lifestyle Factors That Impact Risk",
    description: "Modifiable risk factors including diet, exercise, and environmental considerations",
    readTime: "6 min read",
    category: "Prevention",
    content: `
<ol>
  <li>
    <p><strong>Food and Eating Habits</strong></p>
    <p><strong>Negative Effect:</strong> Diets high in fried foods, sugary snacks, red meat, and processed foods can cause inflammation and make it easier for cancer cells to grow.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Eat more fruits, vegetables, whole grains, and beans.</li>
      <li>Choose healthy fats (nuts, seeds, olive oil) instead of fried or greasy foods.</li>
      <li>Limit alcohol to no more than 1 drink per day—or avoid it.</li>
    </ul>
  </li>
  <li>
    <p><strong>Physical Activity</strong></p>
    <p><strong>Negative Effect:</strong> Sitting too much can lead to weight gain and higher estrogen levels, which can feed some breast cancers.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Be active for at least 30 minutes, 5 days a week.</li>
      <li>Activities can include walking, dancing, cleaning, playing sports, or gardening.</li>
      <li>Break it up into shorter sessions if needed—every bit counts.</li>
    </ul>
  </li>
  <li>
    <p><strong>Body Weight</strong></p>
    <p><strong>Negative Effect:</strong> After menopause, extra body fat produces more estrogen, increasing breast cancer risk.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Balance what you eat with how much you move.</li>
      <li>Make small changes—like reducing sugary drinks or walking after meals.</li>
      <li>Even losing 5–10% of your body weight can improve health.</li>
    </ul>
  </li>
  <li>
    <p><strong>Alcohol</strong></p>
    <p><strong>Negative Effect:</strong> Alcohol can damage DNA in cells and change hormone levels, raising risk.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Limit alcohol to 0–1 drink per day.</li>
      <li>Try alcohol-free days each week or choose non-alcoholic drinks.</li>
    </ul>
  </li>
  <li>
    <p><strong>Smoking</strong></p>
    <p><strong>Negative Effect:</strong> Tobacco contains chemicals that damage DNA and weaken the immune system.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Quit smoking—talk to a doctor, join a support group, or use quit programs.</li>
      <li>Avoid secondhand smoke when possible.</li>
    </ul>
  </li>
  <li>
    <p><strong>Hormone Medicines After Menopause (HRT)</strong></p>
    <p><strong>Negative Effect:</strong> Long-term use of combined estrogen + progesterone can increase risk.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Ask your doctor about non-hormonal treatments for menopause symptoms.</li>
      <li>If you need hormones, use the lowest dose for the shortest time possible.</li>
    </ul>
  </li>
  <li>
    <p><strong>Breastfeeding and Pregnancy</strong></p>
    <p><strong>Negative Effect:</strong> Not breastfeeding or having children later in life may slightly increase risk (though this is not always in your control).</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>If possible, breastfeed for at least 6–12 months.</li>
      <li>Support others who choose to breastfeed.</li>
    </ul>
  </li>
  <li>
    <p><strong>Sleep and Night Shifts</strong></p>
    <p><strong>Negative Effect:</strong> Working at night for many years may disturb hormones like melatonin, which help protect cells from damage.</p>
    <p><strong>What You Can Do:</strong></p>
    <ul>
      <li>Keep a regular sleep routine even during the day.</li>
      <li>Use blackout curtains, earplugs, or eye masks to improve rest.</li>
    </ul>
  </li>
</ol>
    `,
    tags: ["Lifestyle", "Prevention", "Diet"]
  }],
  "prevention": [{
    id: 4,
    title: "Monthly Self-Examination Guide",
    description: "Step-by-step instructions for performing breast self-examinations at home",
    readTime: "4 min read",
    category: "Self-Care",
    content: "Regular self-examination is a crucial part of early detection. Here's how to perform it correctly...",
    tags: ["Self-Exam", "Early Detection", "Self-Care"]
  }, {
    id: 5,
    title: "Nutrition for Breast Health",
    description: "Foods and dietary patterns that may help reduce breast cancer risk",
    readTime: "8 min read",
    category: "Nutrition",
    content: "A healthy diet rich in fruits, vegetables, and whole grains may help reduce cancer risk...",
    tags: ["Nutrition", "Prevention", "Diet"]
  }, {
    id: 6,
    title: "Exercise and Breast Cancer Prevention",
    description: "How physical activity can reduce your risk and improve overall health",
    readTime: "5 min read",
    category: "Exercise",
    content: "Regular physical activity is one of the most effective ways to reduce breast cancer risk...",
    tags: ["Exercise", "Prevention", "Health"]
  }],
  "support": [{
    id: 7,
    title: "Building Your Support Network",
    description: "Creating a strong support system during your health journey",
    readTime: "6 min read",
    category: "Emotional Health",
    content: "Support saves lives. In Ghana, emotional, informational, financial, and spiritual support improved patients’ wellbeing and treatment outcomes. Nurses and doctors offered guidance on side effects and self‑care; families, friends, and faith communities provided encouragement; some patients received financial help while others struggled, even selling belongings to continue care. Lack of support led to distress, delays, and worse outcomes. Building strong support networks—and normalizing requests for help—should be seen as part of care, not an extra. Based on “Availability, Accessibility, and Impact of Social Support on Breast Cancer Treatment in Kumasi, Ghana.”",
    tags: ["Support", "Mental Health", "Community"]
  }, {
    id: 8,
    title: "Talking to Family About Cancer Risk",
    description: "How to have important conversations about family history and genetic testing",
    readTime: "7 min read",
    category: "Communication",
    content: "Cultural, religious, and spiritual beliefs in Ghana powerfully shape how women perceive and respond to breast symptoms. Some view cancer as a curse or spiritual attack, seek help first from traditional healers or prayer camps, or believe it is contagious or incurable—delaying diagnosis and treatment. Compassionate, culturally sensitive education and open family conversations can dispel myths and encourage timely medical care. Based on the review “Socio‑cultural beliefs and perceptions influencing diagnosis and treatment of breast cancer among women in Ghana.”",
    tags: ["Family", "Communication", "Genetics"]
  }, {
    id: 9,
    title: "Managing Anxiety About Cancer Risk",
    description: "Coping strategies for dealing with worry and anxiety about breast cancer",
    readTime: "5 min read",
    category: "Mental Health",
    content: "It's natural to feel anxious about cancer risk. Here are healthy ways to manage these feelings...",
    tags: ["Anxiety", "Mental Health", "Coping"]
  }]
};
const featuredResources = [{
  title: "Ghana Breast Society (GBS)",
  description: "Official professional society with breast cancer resources and updates in Ghana",
  url: "https://ghbreastsociety.com/",
  type: "Organization"
}, {
  title: "Genetic Counselling Resources (McGill University Library)",
  description: "Curated guides on genetic counselling and patient support",
  url: "https://libraryguides.mcgill.ca/human-genetics/genetic-counselling",
  type: "Guide"
}];
export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  useSEO({
    title: "Learn More about Triple‑Negative Breast Cancer (TNBC) in Ghana | She’s Strong",
    description: "TNBC basics, risk, symptoms, screening, and support for women in Ghana. Learn what to watch for and the next steps to protect your health.",
    canonical: typeof window !== "undefined" ? `${window.location.origin}/education` : "/education"
  });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [{
      "@type": "Question",
      name: "Is TNBC more aggressive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It can grow and spread faster than some other types, so early detection is important."
      }
    }, {
      "@type": "Question",
      name: "Can lifestyle reduce risk?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Healthy weight, regular activity, limited alcohol, and smoke‑free living support overall breast health."
      }
    }, {
      "@type": "Question",
      name: "Do all breast lumps mean cancer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No—many are benign. Still, any new lump should be checked by a clinician."
      }
    }]
  };
  const getAllArticles = () => {
    return [...educationalContent["risk-factors"], ...educationalContent.prevention, ...educationalContent.support];
  };
  const filteredArticles = getAllArticles().filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.description.toLowerCase().includes(searchTerm.toLowerCase()) || article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  if (selectedArticle) {
    return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="outline" onClick={() => setSelectedArticle(null)} className="mb-6">
            ← Back to Education Hub
          </Button>
          
          <Card className="shadow-medical bg-gradient-card">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{selectedArticle.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedArticle.readTime}
                </span>
              </div>
              <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
              <CardDescription className="text-lg">{selectedArticle.description}</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none [&_ol>li>p:first-of-type>strong]:text-lg md:[&_ol>li>p:first-of-type>strong]:text-xl [&_ol>li>p:first-of-type>strong]:block [&_ol>li>p:first-of-type]:mb-1 [&_ul]:list-disc [&_ul]:pl-5">
              {typeof selectedArticle.content === "string" ? (
                <div className="text-foreground leading-relaxed text-base" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              ) : (
                <div className="text-foreground leading-relaxed text-base">{selectedArticle.content}</div>
              )}
              
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-3">Key Takeaways:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>Early detection significantly improves treatment outcomes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>Regular screening is essential for high-risk individuals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    <span>Lifestyle modifications can help reduce overall risk</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {selectedArticle.tags.map((tag: string) => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Education Hub</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Reliable, evidence-based information about breast cancer prevention, risk factors, and support resources
          </p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search articles, topics, or tags..." className="pl-10" />
          </div>
        </div>

        {/* Learn More Section */}
        <section aria-labelledby="learn-more-heading" className="mb-10">
          <Card className="bg-gradient-card shadow-medical">
            <CardContent className="p-6 md:p-8">
              <article>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-2">
                    <h1 id="learn-more-heading" className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
                      Learn More: Triple‑Negative Breast Cancer (TNBC)
                    </h1>
                    <p className="text-muted-foreground text-lg mb-6">
                      Triple‑negative breast cancer (TNBC) is a type of breast cancer that tests negative for estrogen, progesterone, and HER2 receptors. Because it grows differently, it may spread faster and respond to different treatments. Early detection and prompt care make a real difference.
                    </p>

                    <section aria-labelledby="key-facts" className="mb-6">
                      <h2 id="key-facts" className="text-xl font-semibold mb-2">Why TNBC Matters: Key Facts</h2>
                      <ul className="list-disc pl-5 space-y-1 text-foreground">
                        <li>About 15% of breast cancers are triple‑negative.</li>
                        <li>Early detection improves treatment options and outcomes.</li>
                        <li>Some families have higher risk due to shared genetics and history.</li>
                        <li>Awareness plus regular self‑checks and screening can save lives.</li>
                      </ul>
                    </section>
                  </div>
                  <div>
                    <img src="/lovable-uploads/9b92abbb-cd8a-4ebc-9559-42ec68c756e9.png" alt="Illustration of breast cancer cell types: HR+, HER2+, and triple‑negative" loading="lazy" className="w-full h-40 md:h-48 object-cover rounded-lg" />
                  </div>
                </div>

                <section aria-labelledby="higher-risk" className="mb-6">
                  <h2 id="higher-risk" className="text-xl font-semibold mb-2">Who Is at Higher Risk?</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Personal or family history of breast, ovarian, prostate, or pancreatic cancer</li>
                    <li>A close relative diagnosed at a younger age</li>
                    <li>Certain inherited genetic changes (mutations)</li>
                    <li>Limited access to screening or delays in follow‑up</li>
                  </ul>
                </section>

                <section aria-labelledby="symptoms" className="mb-6">
                  <h2 id="symptoms" className="text-xl font-semibold mb-2">Common Signs and Symptoms</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>A new lump or thickening in the breast or underarm</li>
                    <li>Changes in breast size, shape, or skin (dimpling, redness, scaling)</li>
                    <li>Nipple changes or discharge not related to breastfeeding</li>
                    <li>Persistent pain in one area of the breast</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">If you notice a change that lasts more than 2 weeks, get it checked.</p>
                </section>

                <section aria-labelledby="screening" className="mb-6">
                  <h2 id="screening" className="text-xl font-semibold mb-2">Screening and When to See a Clinician</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Know your normal: perform regular self‑checks.</li>
                    <li>If you feel a new lump or see changes, contact a clinician promptly.</li>
                    <li>Follow your clinician’s advice on clinical breast exams and imaging based on your age, risk, and history.</li>
                  </ul>
                </section>

                <section aria-labelledby="family-history" className="mb-6">
                  <h2 id="family-history" className="text-xl font-semibold mb-2">Family History and Genetics</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Family history can increase risk. Let your clinician know if your mother, father, sisters, brothers, grandparents, aunts, or uncles have had cancer.</li>
                    <li>Your mother’s age at diagnosis can help guide your personal risk discussion.</li>
                    <li>Genetic counseling/testing may be recommended for some families.</li>
                  </ul>
                </section>

                <section aria-labelledby="how-we-help" className="mb-6">
                  <h2 id="how-we-help" className="text-xl font-semibold mb-2">How She’s Strong Ghana Helps</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Risk Assessment: Answer a few questions to understand your risk profile.</li>
                    <li>Symptom Tracking: Record changes and get reminders to follow up.</li>
                    <li>Education Hub: Reliable, easy‑to‑read guidance about TNBC and breast health.</li>
                    <li>Care Navigation: Find and prepare for appointments with specialists.</li>
                  </ul>
                </section>

                <section aria-labelledby="next-steps" className="mb-2">
                  <h2 id="next-steps" className="text-xl font-semibold mb-2">What You Can Do Today</h2>
                  <ul className="list-disc pl-5 space-y-1 mb-3">
                    <li>Start the risk assessment to document family history.</li>
                    <li>Set a monthly reminder for a self‑check.</li>
                    <li>Note any breast changes and book an appointment if something feels new or different.</li>
                    <li>Share this resource with someone you care about.</li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild size="sm" className="bg-gradient-primary">
                      <Link to="/family-history">Start Risk Assessment</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/symptoms">Track Symptoms</Link>
                    </Button>
                    <Button asChild variant="secondary" size="sm">
                      <Link to="/appointments">Find Care</Link>
                    </Button>
                  </div>
                </section>
              </article>
              <script type="application/ld+json" dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqSchema)
            }} />
            </CardContent>
          </Card>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getAllArticles().length}</p>
                  <p className="text-sm text-muted-foreground">Educational articles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm text-muted-foreground">Women helped</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Expert</p>
                  <p className="text-sm text-muted-foreground">Reviewed content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Topics</TabsTrigger>
                <TabsTrigger value="risk-factors">Risk Factors</TabsTrigger>
                <TabsTrigger value="prevention">Prevention</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 gap-6">
                  {filteredArticles.map(article => <Card key={article.id} className="cursor-pointer hover:shadow-medical transition-shadow bg-gradient-card">
                      <CardContent className="p-6" onClick={() => setSelectedArticle(article)}>
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-4">{article.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </TabsContent>

              {Object.entries(educationalContent).map(([category, articles]) => <TabsContent key={category} value={category} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    {articles.map(article => <Card key={article.id} className="cursor-pointer hover:shadow-medical transition-shadow bg-gradient-card">
                        <CardContent className="p-6" onClick={() => setSelectedArticle(article)}>
                          <div className="flex items-start justify-between mb-3">
                            <Badge variant="secondary">{article.category}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {article.readTime}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          <p className="text-muted-foreground mb-4">{article.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </TabsContent>)}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Resources */}
            <Card className="shadow-medical bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Featured Resources</CardTitle>
                <CardDescription>External links and organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featuredResources.map((resource, index) => <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer" className="block border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30" aria-label={`${resource.title} - opens in a new tab`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </a>)}
              </CardContent>
            </Card>

            {/* Emergency Information */}
            <Card className="shadow-medical bg-gradient-card border-warning/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <CardTitle className="text-lg">When to Seek Help</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <p className="font-medium">Contact a healthcare provider if you notice:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• New lump or thickening in breast or underarm</li>
                    <li>• Changes in breast size or shape</li>
                    <li>• Nipple discharge (other than breast milk)</li>
                    <li>• Skin changes on breast</li>
                  </ul>
                </div>
                <Button className="w-full bg-gradient-primary" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Emergency Contacts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}