import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  ExternalLink,
  Clock,
  Users,
  Award
} from "lucide-react";

const educationalContent = {
  "risk-factors": [
    {
      id: 1,
      title: "Understanding Triple-Negative Breast Cancer",
      description: "Learn about this aggressive form of breast cancer and why early detection is crucial",
      readTime: "5 min read",
      category: "Basics",
      content: "Triple-Negative Breast Cancer (TNBC) is one of the most aggressive forms—fast-growing, harder to treat, and more common in younger women and those of African ancestry. TNBC does not respond to hormone therapies, so chemotherapy is often the mainstay. There is hope: newer targeted options like PARP inhibitors and immunotherapy show benefit, especially for people with BRCA mutations. Early detection, knowing your risk, and staying informed can make a real difference. Based on “An Overview of Triple‑Negative Breast Cancer” by Pankaj Kumar & Rupali Aggarwal.",
      tags: ["TNBC", "Basics", "Detection"]
    },
    {
      id: 2,
      title: "Genetic Risk Factors in Ghanaian Women",
      description: "Exploring hereditary factors and family history patterns specific to Ghanaian populations",
      readTime: "7 min read",
      category: "Genetics",
      content: "Women of African ancestry—especially Ghanaian women—face a disproportionately high risk of triple‑negative breast cancer (TNBC). A landmark analysis found 82% of Ghanaian breast cancer cases were TNBC, versus 26% in African Americans and 16% in white Americans. Ghanaian women were diagnosed younger (average age ~48) and with more aggressive tumors (76% grade 3). These patterns point to genetic contributors beyond socioeconomic factors and underline the need for targeted research, earlier detection, and broader access to genetic testing. Based on “African Ancestry and Higher Prevalence of Triple‑Negative Breast Cancer” by Azadeh Stark et al., Cancer (2010).",
      tags: ["Genetics", "Family History", "Ghana"]
    },
    {
      id: 3,
      title: "Lifestyle Factors That Impact Risk",
      description: "Modifiable risk factors including diet, exercise, and environmental considerations",
      readTime: "6 min read",
      category: "Prevention",
      content: "This population‑based study of 3,200+ Ghanaian women examined how childbirth and breastfeeding relate to risk across tumor subtypes. Under 50: higher parity increased ER‑negative risk, but extended breastfeeding (≥13 months per child) helped offset it. Age 50+: more births and longer breastfeeding reduced risk across subtypes; ≥3 births with ≥13 months per child was most protective. TNBC was more common in younger women and linked to higher parity without extended breastfeeding; luminal A‑like tumors were more common in older women and strongly reduced by extended breastfeeding. Trends (1945–1975 cohorts) showed fewer births, slightly older first birth, and a dip then rise in breastfeeding—patterns that may shift subtype incidence. Public health: promote extended breastfeeding, educate younger women, and tailor screening to Ghana’s context. Based on a large population‑based study in Ghana.",
      tags: ["Lifestyle", "Prevention", "Diet"]
    }
  ],
  "prevention": [
    {
      id: 4,
      title: "Monthly Self-Examination Guide",
      description: "Step-by-step instructions for performing breast self-examinations at home",
      readTime: "4 min read",
      category: "Self-Care",
      content: "Regular self-examination is a crucial part of early detection. Here's how to perform it correctly...",
      tags: ["Self-Exam", "Early Detection", "Self-Care"]
    },
    {
      id: 5,
      title: "Nutrition for Breast Health",
      description: "Foods and dietary patterns that may help reduce breast cancer risk",
      readTime: "8 min read",
      category: "Nutrition",
      content: "A healthy diet rich in fruits, vegetables, and whole grains may help reduce cancer risk...",
      tags: ["Nutrition", "Prevention", "Diet"]
    },
    {
      id: 6,
      title: "Exercise and Breast Cancer Prevention",
      description: "How physical activity can reduce your risk and improve overall health",
      readTime: "5 min read",
      category: "Exercise",
      content: "Regular physical activity is one of the most effective ways to reduce breast cancer risk...",
      tags: ["Exercise", "Prevention", "Health"]
    }
  ],
  "support": [
    {
      id: 7,
      title: "Building Your Support Network",
      description: "Creating a strong support system during your health journey",
      readTime: "6 min read",
      category: "Emotional Health",
      content: "Support saves lives. In Ghana, emotional, informational, financial, and spiritual support improved patients’ wellbeing and treatment outcomes. Nurses and doctors offered guidance on side effects and self‑care; families, friends, and faith communities provided encouragement; some patients received financial help while others struggled, even selling belongings to continue care. Lack of support led to distress, delays, and worse outcomes. Building strong support networks—and normalizing requests for help—should be seen as part of care, not an extra. Based on “Availability, Accessibility, and Impact of Social Support on Breast Cancer Treatment in Kumasi, Ghana.”",
      tags: ["Support", "Mental Health", "Community"]
    },
    {
      id: 8,
      title: "Talking to Family About Cancer Risk",
      description: "How to have important conversations about family history and genetic testing",
      readTime: "7 min read",
      category: "Communication",
      content: "Cultural, religious, and spiritual beliefs in Ghana powerfully shape how women perceive and respond to breast symptoms. Some view cancer as a curse or spiritual attack, seek help first from traditional healers or prayer camps, or believe it is contagious or incurable—delaying diagnosis and treatment. Compassionate, culturally sensitive education and open family conversations can dispel myths and encourage timely medical care. Based on the review “Socio‑cultural beliefs and perceptions influencing diagnosis and treatment of breast cancer among women in Ghana.”",
      tags: ["Family", "Communication", "Genetics"]
    },
    {
      id: 9,
      title: "Managing Anxiety About Cancer Risk",
      description: "Coping strategies for dealing with worry and anxiety about breast cancer",
      readTime: "5 min read",
      category: "Mental Health",
      content: "It's natural to feel anxious about cancer risk. Here are healthy ways to manage these feelings...",
      tags: ["Anxiety", "Mental Health", "Coping"]
    }
  ]
};

const featuredResources = [
  {
    title: "Ghana Breast Cancer Awareness Organization",
    description: "Local support and resources for breast cancer awareness in Ghana",
    url: "#",
    type: "Organization"
  },
  {
    title: "WHO Breast Cancer Guidelines",
    description: "International guidelines for breast cancer prevention and screening",
    url: "#",
    type: "Guidelines"
  },
  {
    title: "Genetic Counseling Resources",
    description: "Information about genetic testing and counseling services",
    url: "#",
    type: "Services"
  }
];

export default function Education() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const getAllArticles = () => {
    return [
      ...educationalContent["risk-factors"],
      ...educationalContent.prevention,
      ...educationalContent.support
    ];
  };

  const filteredArticles = getAllArticles().filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button 
            variant="outline" 
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
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
            <CardContent className="prose prose-slate max-w-none">
              <p className="text-foreground leading-relaxed text-base">
                {selectedArticle.content}
              </p>
              
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
                {selectedArticle.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Education Hub</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Reliable, evidence-based information about breast cancer prevention, risk factors, and support resources
          </p>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles, topics, or tags..."
              className="pl-10"
            />
          </div>
        </div>

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
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-medical transition-shadow bg-gradient-card">
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
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {Object.entries(educationalContent).map(([category, articles]) => (
                <TabsContent key={category} value={category} className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    {articles.map((article) => (
                      <Card key={article.id} className="cursor-pointer hover:shadow-medical transition-shadow bg-gradient-card">
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
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
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
                {featuredResources.map((resource, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                        <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </div>
                ))}
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
    </div>
  );
}