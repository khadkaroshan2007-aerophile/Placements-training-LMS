import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { cookies } from "next/headers";
import { AUTH_COOKIE, getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const user = token ? await getSessionUser(token) : null;

  // If user is already authenticated, take them directly to their active workspace
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span>PlacePrep AI</span>
        </Link>
        <div>
          <Link href="/login" className="landing-login">Sign in</Link>
          <Link href="/dashboard" className="landing-cta">Open demo <ArrowRight size={15} /></Link>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge"><span /> BUILT FOR YOUR NEXT CHAPTER</div>
          <h1>Your placement journey,<br /><em>made clearer.</em></h1>
          <p>Build skills with purpose, see how far you’ve come, and feel more prepared for the opportunities ahead.</p>
          <div className="hero-actions">
            <Link href="/dashboard" className="landing-cta large">Explore the student demo <ArrowRight size={16} /></Link>
            <Link href="/login" className="hero-secondary">I already have an account</Link>
          </div>
          <div className="hero-proof"><CheckCircle2 size={15} /> A focused space for learning and career readiness</div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-tile">
            <div className="tile-top"><span>YOUR READINESS</span><span className="tile-pill">DEMO</span></div>
            <div className="tile-score">72<span>/100</span></div>
            <div className="hero-track"><i /></div>
            <div className="tile-bottom"><span>On your way</span><span>+8 this month</span></div>
          </div>
          <div className="floating-card">
            <span className="floating-icon"><BookOpenCheck size={17} /></span>
            <span><b>Learning in motion</b><small>24 lessons complete</small></span>
            <CheckCircle2 size={15} color="#3d9b78" />
          </div>
          <div className="floating-card second">
            <span className="floating-icon brain"><BrainCircuit size={17} /></span>
            <span><b>Know your next step</b><small>Personalized practice</small></span>
          </div>
        </div>
      </section>
      <section className="feature-strip">
        <div>
          <span className="feature-icon"><BookOpenCheck size={19} /></span>
          <span><b>Learn with direction</b><small>Courses for skills employers value</small></span>
        </div>
        <div>
          <span className="feature-icon green"><BarChart3 size={19} /></span>
          <span><b>See your progress</b><small>Understand where to focus next</small></span>
        </div>
        <div>
          <span className="feature-icon orange"><BrainCircuit size={19} /></span>
          <span><b>Practice with purpose</b><small>Build confidence one step at a time</small></span>
        </div>
      </section>
      <footer className="landing-footer">
        <span>PlacePrep AI <small>· A learning workspace preview</small></span>
        <span>Sample experience · No account required</span>
      </footer>
      <style>{`.landing{min-height:100vh;background:#fafaff;color:#18213d;padding:0 max(6vw,24px)}.landing-nav{height:82px;display:flex;align-items:center;justify-content:space-between;max-width:1200px;margin:auto;border-bottom:1px solid #ececf5}.landing-nav .brand{padding:0;color:#18213d}.landing-nav>div{display:flex;align-items:center;gap:24px}.landing-login{color:#68728e;font-size:13px;font-weight:600}.landing-cta{display:inline-flex;align-items:center;gap:8px;border-radius:9px;background:#6258e8;color:#fff;padding:11px 15px;font-size:12px;font-weight:700;box-shadow:0 7px 16px rgba(98,88,232,.17)}.landing-cta:hover{background:#5148d0}.hero{max-width:1200px;margin:0 auto;min-height:520px;display:grid;grid-template-columns:1.03fr .97fr;align-items:center;gap:35px;padding:45px 0 55px}.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border-radius:30px;background:#f0efff;color:#6258e8;font-size:9px;letter-spacing:1px;font-weight:750}.hero-badge span{width:6px;height:6px;background:#6258e8;border-radius:50%}.hero h1{font-size:clamp(38px,5vw,62px);line-height:1.08;letter-spacing:-2.7px;margin:22px 0 17px;color:#17203b}.hero h1 em{font-style:normal;color:#6258e8}.hero-copy>p{max-width:485px;font-size:15px;line-height:1.8;color:#7a839b}.hero-actions{display:flex;align-items:center;gap:22px;margin-top:27px}.landing-cta.large{padding:14px 17px;font-size:12px}.hero-secondary{font-size:11px;color:#76809a;font-weight:600}.hero-proof{display:flex;align-items:center;gap:8px;margin-top:28px;color:#8b93a8;font-size:10px}.hero-proof svg{color:#48a47d}.hero-art{height:355px;position:relative;display:grid;place-items:center}.orbit{position:absolute;border:1px solid #e9e8fb;border-radius:50%;width:365px;height:290px;transform:rotate(-21deg)}.orbit-two{width:440px;height:350px;transform:rotate(32deg);border-color:#f0effb}.hero-tile{position:relative;z-index:1;width:280px;padding:22px 23px;background:white;border:1px solid #ececf4;border-radius:18px;box-shadow:0 20px 70px rgba(44,43,107,.12)}.tile-top,.tile-bottom{display:flex;align-items:center;justify-content:space-between}.tile-top{font-size:9px;letter-spacing:1px;color:#8f97aa;font-weight:700}.tile-pill{padding:4px 7px;border-radius:15px;background:#f1efff;color:#6258e8;font-size:8px}.tile-score{font-size:49px;font-weight:750;letter-spacing:-2px;margin:22px 0 16px}.tile-score span{font-size:16px;color:#9da4b5;font-weight:500;letter-spacing:0}.hero-track{height:7px;background:#f0f1f7;border-radius:8px}.hero-track i{display:block;width:72%;height:100%;background:linear-gradient(90deg,#6258e8,#928afa);border-radius:8px}.tile-bottom{font-size:10px;color:#8b94a9;margin-top:10px}.tile-bottom span+span{color:#359b73;font-weight:700}.floating-card{position:absolute;right:-6px;top:57px;z-index:2;display:flex;gap:10px;align-items:center;background:white;border:1px solid #edecf4;box-shadow:0 10px 35px rgba(40,45,85,.09);border-radius:12px;padding:12px}.floating-icon,.feature-icon{width:34px;height:34px;border-radius:10px;background:#f0efff;color:#6258e8;display:grid;place-items:center}.floating-card b{font-size:10px;display:block}.floating-card small{font-size:9px;color:#929aaf;display:block;margin-top:4px}.floating-card.second{right:auto;left:-3px;top:auto;bottom:48px}.floating-icon.brain{background:#e9f7f1;color:#3d9b78}.feature-strip{max-width:1200px;margin:0 auto;border:1px solid #ececf4;background:#fff;border-radius:15px;display:grid;grid-template-columns:repeat(3,1fr);padding:22px 26px;box-shadow:0 6px 25px rgba(41,45,89,.03)}.feature-strip>div{display:flex;align-items:center;gap:13px;padding-left:clamp(0px,3vw,37px);border-left:1px solid #eeeef5}.feature-strip>div:first-child{border:0;padding-left:0}.feature-icon.green{background:#e7f7f0;color:#3d9b78}.feature-icon.orange{background:#fff1e7;color:#d88b4e}.feature-strip b{display:block;font-size:11px}.feature-strip small{display:block;color:#929aaf;font-size:9px;margin-top:5px}.landing-footer{max-width:1200px;margin:25px auto 0;padding:15px 0;display:flex;justify-content:space-between;color:#7e879d;font-size:10px}.landing-footer small{color:#a0a7b8}@media(max-width:760px){.landing-nav{height:68px}.landing-nav>div{gap:14px}.landing{padding:0 17px}.hero{grid-template-columns:1fr;padding:45px 0 18px;gap:5px}.hero h1{font-size:43px;letter-spacing:-1.9px}.hero-copy>p{font-size:13px}.hero-art{height:315px;overflow:hidden}.orbit{max-width:100%}.floating-card{right:0;top:42px}.floating-card.second{left:0;bottom:34px}.feature-strip{grid-template-columns:1fr;gap:17px;padding:18px}.feature-strip>div{border:0;padding:0}.landing-footer{gap:12px;flex-wrap:wrap}.hero-actions{gap:15px;flex-wrap:wrap}}`}</style>
    </main>
  );
}
