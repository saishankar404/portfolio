import { Layout } from "@/components/Layout";
import { Mail, Github, Twitter } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-block mb-4 text-3xl">👋</div>
          <h1 className="text-xl font-medium tracking-tight mb-3">
            About
          </h1>
          <p className="text-muted-foreground text-sm">
            A little bit about me and what I do.
          </p>
        </header>

        {/* Bio Section */}
        <section className="space-y-6 mb-12">

          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="absolute top-12 -left-20 items-end gap-1 hidden sm:flex">
                <span className="text-sm text-muted-foreground">me</span>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="text-[#4E66FF]"
                >
                  <path
                    d="M4 35 Q 20 30, 30 15 Q 35 8, 38 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  
                  <path
                    d="M 31 5 L 38 4 L 39 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>


              <div className="h-32 w-28 sm:h-40 sm:w-36 rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                <img
                  src="/sai.jpeg"
                  alt="Sai Shankar"
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-base font-medium">Sai Shankar</h2>
            <p className="text-sm text-muted-foreground">
              Designer & Developer
            </p>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed space-y-4 max-w-lg mx-auto text-center">
            <p>
              i study computer science and spend a lot of my time designing and building things on the web.
            </p>
            <p>
              i've worked on multiple design and web projects, explored branding and ui systems, and shipped things at blazing speed without compromising on quality.
            </p>
            <p>
              i enjoy clean interfaces, strong visual systems, and turning vague ideas into real, usable products. outside of work, i like traveling and thinking about how not to be bored and how to make life fun.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="border-t border-dotted border-border pt-8">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
            Get in Touch
          </h2>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <a
              href="mailto:saishankar2803@gmail.com"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </a>

            <a
              href="https://www.behance.net/saishankar404"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
              </svg>
              <span>Behance</span>
            </a>

            <a
              href="https://github.com/saishankar404"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://x.com/saishankar404"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
