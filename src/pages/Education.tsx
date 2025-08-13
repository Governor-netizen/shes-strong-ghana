import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Heart, Shield, AlertTriangle, CheckCircle, ExternalLink, Clock, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
const educationalContent = {
  "risk-factors": [{
    id: 1,
    title: "Understanding Triple-Negative Breast Cancer",
    description: "Learn about this aggressive form of breast cancer and why early detection is crucial",
    readTime: "5 min read",
    category: "Basics",
    content: `
      <p><strong>Overview</strong></p>
      <p>Triple-Negative Breast Cancer (TNBC) is an aggressive subtype—fast-growing, harder to treat, and more common in younger women and those of African ancestry. It does not respond to hormone therapies; chemotherapy is often the mainstay. There is hope: newer targeted options like PARP inhibitors and immunotherapy show benefit, especially for people with <strong>BRCA</strong> mutations.</p>

      <h3>Epidemiology in Ghana</h3>
      
       <div className="my-6 max-w-2xl mx-auto">
         <AspectRatio ratio={16 / 10} className="bg-muted rounded-lg overflow-hidden shadow-card-soft border">
           <img 
             src="/lovable-uploads/872f6c14-7342-4c84-b5c5-c263f18c854d.png" 
             alt="Heatmap showing the prevalence of triple-negative breast cancer (TNBC) among African nations. Ghana shows the highest recorded rates with darker red shading indicating higher prevalence."
             className="w-full h-full object-contain p-2"
           />
         </AspectRatio>
         <p className="text-sm text-muted-foreground mt-3 text-center font-medium">TNBC prevalence across African nations - Ghana shows some of the highest recorded rates</p>
       </div>

      <ul>
        <li>TNBC made up <strong>~82%</strong> of breast cancers in Ghanaian women (vs <strong>26%</strong> in African Americans and <strong>16%</strong> in white Americans).</li>
        <li>Average age at diagnosis was about <strong>48 years</strong>.</li>
        <li><strong>76%</strong> of tumors were high grade (grade 3).</li>
      </ul>
      <p>These patterns suggest biological and genetic contributors beyond socioeconomic factors, emphasizing early detection, research, and access to care.</p>

      <p class="text-sm text-muted-foreground">Sources: “An Overview of Triple‑Negative Breast Cancer” (P. Kumar & R. Aggarwal) and “African Ancestry and Higher Prevalence of Triple‑Negative Breast Cancer” (A. Stark et al., Cancer 2010).</p>
    `,
    tags: ["TNBC", "Basics", "Detection"]
  }, {
    id: 2,
    title: "Genetic Risk Factors in Ghanaian Women",
    description: "Exploring hereditary factors and family history patterns specific to Ghanaian populations",
    readTime: "7 min read",
    category: "Genetics",
    content: `
       <div className="grid md:grid-cols-2 gap-4 my-6 max-w-xl mx-auto">
         <div>
           <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden shadow-card-soft border">
             <img 
               src="/lovable-uploads/b7edfd68-44db-48f6-80f4-745360ce350a.png" 
               alt="3D visualization of DNA double helix structure with glowing nodes representing genetic mutations that influence breast cancer risk"
               className="w-full h-full object-cover p-1"
             />
           </AspectRatio>
           <p className="text-sm text-muted-foreground mt-2 text-center font-medium">DNA structure and genetic mutations</p>
         </div>
         <div>
           <AspectRatio ratio={1} className="bg-muted rounded-lg overflow-hidden shadow-card-soft border">
             <img 
               src="/lovable-uploads/231ca763-384d-49c9-85a3-59a3933f4d54.png" 
               alt="Simplified DNA helix icon representing genetic testing and hereditary factors in breast cancer risk assessment"
               className="w-full h-full object-contain p-2"
             />
           </AspectRatio>
           <p className="text-sm text-muted-foreground mt-2 text-center font-medium">Genetic testing and hereditary factors</p>
         </div>
       </div>

      <p>Some breast cancers happen because of changes (called mutations) in certain genes that can run in families. The most well-known genes linked to triple-negative breast cancer are called <strong>BRCA1</strong> and <strong>BRCA2</strong>.</p>

      <h3 class="font-semibold">What Are BRCA Genes?</h3>
      <ul>
        <li>BRCA1 and BRCA2 are genes that help protect your cells from growing uncontrollably.</li>
        <li>Harmful changes (mutations) in these genes increase the risk of breast and ovarian cancers.</li>
        <li>Not everyone with breast cancer has BRCA mutations, but for some families, these gene changes are important.</li>
      </ul>

      <h3 class="font-semibold">How Breast Cancer Can Run in Families</h3>
      <ul>
        <li>If a close family member has breast cancer, your risk might be higher.</li>
        <li>Risk depends on which side of the family the gene comes from and who inherited it.</li>
      </ul>

      <h3 class="font-semibold">Example: How You Can Inherit BRCA Gene Changes</h3>
      <ul>
        <li>Imagine your grandmother has a BRCA mutation. She can pass it on to her children.</li>
        <li>Your aunt (your grandmother’s daughter) or your mom might have inherited the gene and developed breast cancer.</li>
        <li>Your mom has two copies of the gene: one mutated (bad) and one normal (good). She can pass either copy to you.</li>
        <li>If your mom passes you the normal copy, and your dad passes you a normal copy too, then you do not inherit the mutation.</li>
        <li>This is why sometimes it looks like the mutation “skips” a generation — it just wasn’t passed on in that family line.</li>
        <li>Also, a father can carry the BRCA mutation and pass it to you, even if he doesn’t get breast cancer himself.</li>
      </ul>

      <h3 class="font-semibold">Why Is This Important?</h3>
      <ul>
        <li>Knowing your family history helps doctors decide if genetic testing might be useful.</li>
        <li>If you have a BRCA mutation, there are special screenings and steps to reduce your risk.</li>
        <li>Family members can also learn about their risks and get tested to stay informed.</li>
      </ul>

      <h3 class="font-semibold">What You Can Do</h3>
      <ul>
        <li>Talk with your family about who has had breast or ovarian cancer.</li>
        <li>Share this information with your healthcare provider.</li>
        <li>Ask if genetic counseling or testing is right for you.</li>
      </ul>
    `,
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
    content: <div className="space-y-6">
        <p><strong>Why it matters:</strong> Regular self-exams help you notice changes early between clinic visits.</p>

        <div id="self-exam-video">
          <h3 className="font-semibold mb-3">Watch: Step-by-step Self-Examination</h3>
          <AspectRatio ratio={16 / 9}>
            <iframe src="https://www.youtube.com/embed/nkPR4ar1EQ4?si=TEOa1L4YRB6l9n0D" title="Breast Self-Examination Step-by-Step Guide" className="w-full h-full rounded-md border" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </AspectRatio>
          <p className="text-muted-foreground mt-2 text-sm">Video resource to guide your monthly self-exam.</p>
        </div>

        <ol className="list-decimal pl-5">
          <li>
            <p><strong>Before you start:</strong> Choose the right time.</p>
            <ul>
              <li>Best time is 3–5 days after your period ends.</li>
              <li>If you no longer menstruate, pick the same day each month.</li>
            </ul>
          </li>
          <li>
            <p><strong>In front of a mirror:</strong> Look for visual changes.</p>
            <ul>
              <li>Stand with arms at your sides, then raise them overhead.</li>
              <li>Check for <strong>changes in size or shape</strong>, <strong>skin dimpling or puckering</strong>, or <strong>nipple changes</strong>.</li>
            </ul>
          </li>
          <li>
            <p><strong>In the shower:</strong> Use the pads of your three middle fingers.</p>
            <ul>
              <li>Move in small circles using <strong>light, medium, then firm pressure</strong>.</li>
              <li>Cover the whole breast, armpit, and collarbone area in a pattern (circular, up-and-down, or wedge).</li>
            </ul>
          </li>
          <li>
            <p><strong>Lying down:</strong> Repeat the exam.</p>
            <ul>
              <li>Place a pillow under your right shoulder and your right hand behind your head (and switch sides).</li>
              <li>Use the same circular pattern and pressure levels to examine each breast.</li>
            </ul>
          </li>
          <li>
            <p><strong>Check the nipples:</strong> Gently squeeze.</p>
            <ul>
              <li>Look for any <strong>discharge</strong> (clear, bloody, or milky) or tenderness.</li>
            </ul>
          </li>
          <li>
            <p><strong>What to do if you find a change:</strong> Don't panic.</p>
            <ul>
              <li>Most changes are not cancer, but <strong>see a clinician promptly</strong> for evaluation.</li>
              <li>If you’re high-risk or unsure, book a screening appointment.</li>
            </ul>
          </li>
        </ol>

        <aside className="p-4 rounded-md bg-muted/50">
          <p className="text-sm"><strong>Note:</strong> Self-exams do not replace clinical breast exams or mammograms.</p>
        </aside>
      </div>,
    tags: ["Self-Exam", "Early Detection", "Self-Care"]
  }, {
    id: 5,
    title: "Nutrition for Breast Health",
    description: "Foods and dietary patterns that may help reduce breast cancer risk",
    readTime: "8 min read",
    category: "Nutrition",
    content: `
      <h3 class="text-lg md:text-xl font-semibold">Foods That May Help Reduce Breast Cancer Risk</h3>

      <h4 class="text-base md:text-lg font-semibold">1. Fruits and Vegetables</h4>
      <ul>
        <li><strong>Examples:</strong> Mangoes, papayas, pineapples, oranges, guava, avocados, tomatoes, garden eggs (eggplants), okra, spinach, kale, and other leafy greens (kontomire).</li>
        <li><strong>Why?</strong> They are full of vitamins, antioxidants, and fiber that protect cells and keep your immune system strong.</li>
      </ul>

      <h4 class="text-base md:text-lg font-semibold">2. Whole Grains and Legumes</h4>
      <ul>
        <li><strong>Examples:</strong> Brown rice, millet, maize (corn), sorghum, beans, cowpeas, lentils, groundnuts (peanuts).</li>
        <li><strong>Why?</strong> These foods are rich in fiber and nutrients that support digestion and help keep your hormones balanced.</li>
      </ul>

      <h4 class="text-base md:text-lg font-semibold">3. Healthy Fats</h4>
      <ul>
        <li><strong>Examples:</strong> Palm oil (used in moderation), avocado, nuts like groundnuts and cashews, and seeds such as flaxseeds or chia seeds (if available).</li>
        <li><strong>Why?</strong> Healthy fats support cell health and can reduce inflammation. Avoid too much fried or processed fat.</li>
      </ul>

      <h4 class="text-base md:text-lg font-semibold">4. Fish and Lean Proteins</h4>
      <ul>
        <li><strong>Examples:</strong> Fresh fish (tilapia, sardines), lean chicken, eggs.</li>
        <li><strong>Why?</strong> Protein helps repair body tissues and supports the immune system.</li>
      </ul>

      <h3 class="text-lg md:text-xl font-semibold">Eating Tips for Breast Health</h3>
      <ul>
        <li>Limit alcohol — if you drink, keep it to no more than one drink per day or avoid it.</li>
        <li>Avoid too much fried or processed food like indomie, excessive fried fish, or heavily processed snacks.</li>
        <li>Eat a variety of colors on your plate — the more colors, the more nutrients.</li>
        <li>Drink plenty of water every day to help your body stay healthy.</li>
      </ul>

      <h3 class="text-lg md:text-xl font-semibold">Sample Ghanaian Meal for Breast Health</h3>
      <ul>
        <li><strong>Breakfast:</strong> Oats porridge or hausa koko with a side of fresh mango or banana slices.</li>
        <li><strong>Lunch:</strong> Brown rice or millet with garden egg stew and steamed kontomire.</li>
        <li><strong>Snack:</strong> Fresh fruit like pineapple or guava.</li>
        <li><strong>Dinner:</strong> Grilled tilapia with okro soup and banku. Boiled yam and plantain also work.</li>
      </ul>
    `,
    tags: ["Nutrition", "Prevention", "Diet"]
  }, {
    id: 6,
    title: "Exercise and Breast Cancer Prevention",
    description: "How physical activity can reduce your risk and improve overall health",
    readTime: "5 min read",
    category: "Exercise",
    content: `
      <p><strong>Exercise and Breast Cancer Prevention</strong></p>
      <p>Moving your body isn’t just good for your mood — it can also lower your risk of breast cancer and improve your overall health.</p>

      <h3>How Does Exercise Help?</h3>
      <ul>
        <li><strong>Lowers estrogen levels:</strong> Physical activity reduces certain hormones, like estrogen, that can encourage breast cancer growth.</li>
        <li><strong>Controls weight:</strong> Exercise helps you maintain a healthy weight, and less body fat means lower breast cancer risk, especially after menopause.</li>
        <li><strong>Boosts immune system:</strong> Being active helps your body fight off diseases and keeps your cells healthy.</li>
        <li><strong>Reduces inflammation:</strong> Regular movement lowers harmful inflammation linked to cancer.</li>
        <li><strong>Improves mental health:</strong> Exercise reduces stress, anxiety, and depression, helping you stay strong in mind and body.</li>
      </ul>

      <h3>How Much Activity Should You Aim For?</h3>
      <ul>
        <li>Try to get at least 30 minutes of moderate exercise, 5 days a week.</li>
        <li>Moderate exercise means you’re moving enough to raise your heart rate and break a sweat but still able to talk comfortably.</li>
      </ul>

      <h3>Easy Ways to Be Active in Daily Life</h3>
      <ul>
        <li>Walk to market or work when you can.</li>
        <li>Dance to your favorite music.</li>
        <li>Do gardening or farming.</li>
        <li>Clean your home energetically.</li>
        <li>Play games or sports with friends or family.</li>
      </ul>

      <h3>Tips to Stay Motivated</h3>
      <ul>
        <li>Find a friend or group to exercise with.</li>
        <li>Set small, achievable goals.</li>
        <li>Choose activities you enjoy.</li>
        <li>Celebrate your progress, no matter how small!</li>
      </ul>
    `,
    tags: ["Exercise", "Prevention", "Health"]
  }],
  "support": [{
    id: 7,
    title: "Building Your Support Network",
    description: "Creating a strong support system during your health journey",
    readTime: "6 min read",
    category: "Emotional Health",
    content: `
      <div className="my-6">
        <AspectRatio ratio={16/10} className="bg-muted rounded-lg overflow-hidden">
          <img 
            src="/lovable-uploads/c64c30e8-7b83-4ec5-ba1e-c6fba6f7c803.png" 
            alt="Illustration showing diverse people connected in a network, representing building support systems and community connections for health journeys"
            className="w-full h-full object-contain"
          />
        </AspectRatio>
        <p className="text-sm text-muted-foreground mt-2 text-center">Building your support network and community connections</p>
      </div>

      <h3 class="text-base md:text-lg font-medium">Building Your Support Network</h3>
      <p>Creating a strong support system during your health journey is an important part of caring for your emotional and practical needs. A strong network can:</p>
      <ul>
        <li><strong>Provide emotional encouragement</strong> during stressful or uncertain times.</li>
        <li><strong>Offer practical help</strong>, such as driving to appointments, assisting with daily tasks, or helping manage medical paperwork.</li>
        <li><strong>Share reliable information</strong> and connect you to helpful resources.</li>
      </ul>

      <h3 class="text-base md:text-lg font-medium">Steps to Build Your Support System</h3>
      <ol>
        <li>
          <p class="text-sm md:text-base font-medium"><strong>Identify Your Circle</strong></p>
          <ul>
            <li>Include family, friends, coworkers, and community members who can offer help or companionship.</li>
          </ul>
        </li>
        <li>
          <p class="text-sm md:text-base font-medium"><strong>Connect with Support Groups</strong></p>
          <ul>
            <li>Look for in-person or online groups where you can meet people going through similar experiences.</li>
            <li>Follow this link to join our online support group and connect with others who understand your journey: <a href="#" target="_blank" rel="noopener noreferrer" class="story-link">Join the Support Group</a></li>
          </ul>
        </li>
        <li>
          <p class="text-sm md:text-base font-medium"><strong>Use Your Care Team</strong></p>
          <ul>
            <li>Your doctors, nurses, and patient navigators can connect you to local services and educational programs.</li>
          </ul>
        </li>
        <li>
          <p class="text-sm md:text-base font-medium"><strong>Communicate Your Needs</strong></p>
          <ul>
            <li>Let your network know what kind of help would be most valuable to you—whether it’s listening, running errands, or providing health updates to others.</li>
          </ul>
        </li>
        <li>
          <p class="text-sm md:text-base font-medium"><strong>Stay in Touch</strong></p>
          <ul>
            <li>Regular check-ins help maintain relationships and keep your support team engaged in your journey.</li>
          </ul>
        </li>
      </ol>
    `,
    tags: ["Support", "Mental Health", "Community"]
  }, {
    id: 8,
    title: "Talking to Family About Cancer Risk",
    description: "How to have important conversations about family history and genetic testing",
    readTime: "7 min read",
    category: "Communication",
    content: `
      <p>Breast cancer can feel scary to think about or talk about — but sharing information with your family is one of the strongest steps you can take to protect your health and theirs.</p>

      <h3><strong>Why Talk About It?</strong></h3>
      <ul>
        <li><strong>Many breast cancers are treated successfully when found early.</strong></li>
        <li><strong>Early detection</strong> means treatment can start sooner, making it more effective and less difficult.</li>
        <li><strong>Knowing your family health history</strong> helps doctors understand your risk better and guide you in prevention and screening.</li>
      </ul>

      <h3><strong>How to Start the Conversation</strong></h3>
      <ul>
        <li>Choose a comfortable time to talk, when everyone can listen and share without rushing.</li>
        <li>Explain why it matters to you — you want to stay healthy and support each other.</li>
        <li>Share what you’ve learned about risk factors and the importance of early exams.</li>
        <li>Ask about any family history of breast or other cancers.</li>
      </ul>

      <h3><strong>Remember:</strong></h3>
      <p><strong>Finding out about risk now</strong> gives you the best chance to act early and stay strong. It’s better to learn about risks and start treatment early than to wait until cancer grows or causes symptoms.</p>
      <p><strong>Talking openly</strong> helps your family be ready and informed — and that’s powerful.</p>
    `,
    tags: ["Family", "Communication", "Genetics"]
  }, {
    id: 9,
    title: "Managing Anxiety About Cancer Risk",
    description: "Coping strategies for dealing with worry and anxiety about breast cancer",
    readTime: "5 min read",
    category: "Mental Health",
    content: `
       <p>It’s natural to feel worried or anxious if you’re thinking about breast cancer risk, especially if it runs in your family or you’re learning new information about your health.</p>

       <h3 class="text-base md:text-lg font-medium">Why Anxiety Happens</h3>
       <ul>
         <li>Fear of the unknown or what might happen can cause stress.</li>
         <li>Thinking about cancer risk can feel overwhelming at times.</li>
         <li>Anxiety is a normal reaction, but it doesn’t have to control you.</li>
       </ul>

       <h3 class="text-base md:text-lg font-medium">Coping Strategies to Help You Feel Stronger</h3>
       <ol>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Get Informed, But Take It Slow</strong></p>
           <ul>
             <li>Learning about breast cancer helps you feel more in control.</li>
             <li>But too much information at once can be overwhelming. Take breaks and ask questions.</li>
           </ul>
         </li>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Talk About Your Feelings</strong></p>
           <ul>
             <li>Share your worries with someone you trust: a family member, friend, or counselor.</li>
             <li>Sometimes just talking helps ease your mind.</li>
           </ul>
         </li>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Practice Relaxation Techniques</strong></p>
           <ul>
             <li>Try deep breathing, meditation, or gentle stretching to calm your body and mind.</li>
             <li>Even a few minutes a day can help reduce stress.</li>
           </ul>
         </li>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Stay Active</strong></p>
           <ul>
             <li>Physical activity is a natural way to reduce anxiety and improve mood.</li>
             <li>Find exercises you enjoy, like walking, dancing, or gardening.</li>
           </ul>
         </li>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Focus on What You Can Control</strong></p>
           <ul>
             <li>You can’t change your genes or family history, but you can make healthy lifestyle choices and attend screenings.</li>
             <li>Celebrate the positive steps you take every day.</li>
           </ul>
         </li>
         <li>
           <p class="text-sm md:text-base font-medium"><strong>Seek Professional Help If Needed</strong></p>
           <ul>
             <li>If anxiety feels too heavy or hard to manage, talk to a healthcare professional.</li>
             <li>Therapists and counselors can provide support and tools to help.</li>
           </ul>
         </li>
       </ol>
     `,
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
  const getTakeawaysFor = (title: string): string[] => {
    switch (title) {
      case "Understanding Triple-Negative Breast Cancer":
        return ["TNBC is more common and often higher grade in Ghana; early detection is vital.", "TNBC lacks hormone receptors; treatment often includes chemo and newer targeted options.", "BRCA mutations may unlock targeted therapies like PARP inhibitors."];
      case "Genetic Risk Factors in Ghanaian Women":
        return ["BRCA1/2 changes can be inherited from either parent and increase risk.", "Knowing family history guides decisions about genetic counseling/testing.", "Sharing information helps relatives understand and manage their own risk."];
      case "Lifestyle Factors That Impact Risk":
        return ["Balanced diet, regular activity, and limiting alcohol/smoking lower risk.", "Small daily changes add up—every bit of movement counts.", "Aim for healthy weight, better sleep, and consider breastfeeding if possible."];
      case "Monthly Self-Examination Guide":
        return ["Do a self‑exam monthly and know your normal.", "Look for lumps, skin/nipple changes, and persistent pain.", "Self‑exams complement, not replace, clinical exams and mammograms."];
      case "Nutrition for Breast Health":
        return ["Prioritize fruits, vegetables, whole grains, legumes, and healthy fats.", "Limit alcohol and heavily fried/processed foods; hydrate daily.", "Use Ghanaian staples—e.g., brown rice, kontomire, garden egg stew—as a healthy base."];
      case "Exercise and Breast Cancer Prevention":
        return ["Aim for at least 30 minutes of moderate activity, 5 days a week.", "Exercise can lower estrogen, weight, inflammation, and improve immunity and mood.", "Build activity into daily life—walking, dancing, chores, gardening."];
      case "Building Your Support Network":
        return ["Strong support improves wellbeing and treatment follow‑through.", "Combine emotional, informational, financial, and spiritual help.", "Ask early—seeking support is part of care, not a luxury."];
      case "Talking to Family About Cancer Risk":
        return ["Open conversations make early detection and prevention more likely.", "Document who had which cancers and at what ages.", "Share what you learn with relatives and clinicians to guide care."];
      case "Managing Anxiety About Cancer Risk":
        return ["Feeling anxious is normal—pace information and talk to someone you trust.", "Practice relaxation and stay active to reduce stress.", "Seek professional support if anxiety interferes with daily life."];
      default:
        return ["Early detection significantly improves outcomes.", "Follow recommended screening for your risk level.", "Healthy lifestyle choices support breast health."];
    }
  };
  useEffect(() => {
    if (selectedArticle) {
      // Scroll to top when any article opens
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      // Additionally, auto-scroll to the video for the self-exam article
      if (selectedArticle?.title === "Monthly Self-Examination Guide") {
        setTimeout(() => {
          const el = document.getElementById("self-exam-video");
          el?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
    }
  }, [selectedArticle]);
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
            <CardContent className="prose prose-slate max-w-none [&_h3]:font-medium [&_ol]:space-y-6 md:[&_ol]:space-y-8 [&_ol>li>p:first-of-type>strong]:text-base md:[&_ol>li>p:first-of-type>strong]:text-lg [&_ol>li>p:first-of-type>strong]:block [&_ol>li>p:first-of-type]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:story-link rounded-none">
                {typeof selectedArticle.content === "string" ? <div className="text-foreground leading-relaxed text-base md:text-[17px]" dangerouslySetInnerHTML={{
              __html: selectedArticle.content
            }} /> : <div className="text-foreground leading-relaxed text-base md:text-[17px]">{selectedArticle.content}</div>}
              
              <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-3">Key Takeaways:</h3>
                <ul className="space-y-3">
                  {getTakeawaysFor(selectedArticle.title).map((point, idx) => <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 shrink-0 text-success mt-0.5" />
                      <span>{point}</span>
                    </li>)}
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
        <section aria-labelledby="learn-more-heading" className="mb-12">
          <Card className="bg-gradient-card shadow-medical">
            <CardContent className="p-6 md:p-8">
              <Accordion type="single" collapsible>
                <AccordionItem value="tnbc-info">
                  <AccordionTrigger className="py-0">
                    <h2 id="learn-more-heading" className="text-3xl md:text-4xl font-bold mb-0 bg-gradient-hero bg-clip-text text-transparent">
                      Learn More: Triple‑Negative Breast Cancer (TNBC)
                    </h2>
                  </AccordionTrigger>
                  <AccordionContent className="mt-6 md:mt-8">
                    <article>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        <div className="md:col-span-2">
                          <p className="text-muted-foreground text-lg mb-6">
                            Triple‑negative breast cancer (TNBC) is a type of breast cancer that tests negative for estrogen, progesterone, and HER2 receptors. Because it grows differently, it may spread faster and respond to different treatments. Early detection and prompt care make a real difference.
                          </p>

                          <section aria-labelledby="key-facts" className="mb-6">
                            <h3 id="key-facts" className="text-xl font-semibold mb-2">Why TNBC Matters: Key Facts</h3>
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
                        <h3 id="higher-risk" className="text-xl font-semibold mb-2">Who Is at Higher Risk?</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Personal or family history of breast, ovarian, prostate, or pancreatic cancer</li>
                          <li>A close relative diagnosed at a younger age</li>
                          <li>Certain inherited genetic changes (mutations)</li>
                          <li>Limited access to screening or delays in follow‑up</li>
                        </ul>
                      </section>

                      <section aria-labelledby="symptoms" className="mb-6">
                        <h3 id="symptoms" className="text-xl font-semibold mb-2">Common Signs and Symptoms</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>A new lump or thickening in the breast or underarm</li>
                          <li>Changes in breast size, shape, or skin (dimpling, redness, scaling)</li>
                          <li>Nipple changes or discharge not related to breastfeeding</li>
                          <li>Persistent pain in one area of the breast</li>
                        </ul>
                        <p className="text-sm text-muted-foreground mt-2">If you notice a change that lasts more than 2 weeks, get it checked.</p>
                      </section>

                      <section aria-labelledby="screening" className="mb-6">
                        <h3 id="screening" className="text-xl font-semibold mb-2">Screening and When to See a Clinician</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Know your normal: perform regular self‑checks.</li>
                          <li>If you feel a new lump or see changes, contact a clinician promptly.</li>
                          <li>Follow your clinician’s advice on clinical breast exams and imaging based on your age, risk, and history.</li>
                        </ul>
                      </section>

                      <section aria-labelledby="family-history" className="mb-6">
                        <h3 id="family-history" className="text-xl font-semibold mb-2">Family History and Genetics</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Family history can increase risk. Let your clinician know if your mother, father, sisters, brothers, grandparents, aunts, or uncles have had cancer.</li>
                          <li>Your mother’s age at diagnosis can help guide your personal risk discussion.</li>
                          <li>Genetic counseling/testing may be recommended for some families.</li>
                        </ul>
                      </section>

                      <section aria-labelledby="how-we-help" className="mb-6">
                        <h3 id="how-we-help" className="text-xl font-semibold mb-2">How She’s Strong Ghana Helps</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Risk Assessment: Answer a few questions to understand your risk profile.</li>
                          <li>Symptom Tracking: Record changes and get reminders to follow up.</li>
                          <li>Education Hub: Reliable, easy‑to‑read guidance about TNBC and breast health.</li>
                          <li>Care Navigation: Find and prepare for appointments with specialists.</li>
                        </ul>
                      </section>

                      <section aria-labelledby="next-steps" className="mb-2">
                        <h3 id="next-steps" className="text-xl font-semibold mb-2">What You Can Do Today</h3>
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
                          <Button asChild size="sm" className="bg-gradient-primary">
                            <Link to="/symptoms">Track Symptoms</Link>
                          </Button>
                          <Button asChild variant="secondary" size="sm">
                            <Link to="/appointments">Find Care</Link>
                          </Button>
                        </div>
                      </section>
                    </article>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
              <TabsList className="flex flex-wrap gap-1 md:gap-2">
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