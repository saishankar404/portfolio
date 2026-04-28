# Align
### a 14-day commitment app that helps you set your directions, pick your moves, and ensure you show up for your future self.

[insert pic of 3 screens of the app / hero / landing page footage]

### Metrics

- 521 users
- 2000 visits
- 1050 moves created

### Role
Founder, Interaction & Visual Design

### Opportunity
i had a planning problem.

every sunday i’d plan the “perfect” week. notion, lists, priorities. it felt productive, but it wasn’t. monday comes, i’m staring at 40 tasks, paralyzed by choice. by midweek i’ve dropped the system entirely. i’m just reacting, regretting that i couldn’t keep up, and looping through this cycle forever.

the first thing i asked myself was: why would people like me even use this? do we really need another tracking app? another gamified system dangling streaks to keep you hooked? or maybe we need something different. something that actually works. something that feels so right that you keep coming back—not because of the pressure to keep a streak alive, or a cheap dopamine hit, but because it actually makes the work happen.

### Problem

the problem isn’t laziness. it’s optionality. when everything is important, nothing is.

i tried a bunch of productivity apps, and the pattern was always the same. they help you organize better, not act better. more structure on top of chaos is still just chaos.

so i removed most of it. 
i built something with one absolute constraint.

### Context
i originally started this as a personal tracker just to keep myself accountable. but then i realized: i can't be the only one facing this. at the time, i was building a highly customized version that strayed from the core concept—it was becoming just another pretty organization app. it looked good, but it lacked the impact i was searching for.

[insert align_old footages]

### Process

i scrapped the old idea and the entire UI i was almost finished with. i went back to the foundations and rebuilt it around specific, unyielding constraints. 

i focused on three main factors:

* **Usability:** making it effortless to create moves without overthinking.
[insert wireframe pics]

* **Interactions:** fluidly moving from setting directions to logging moves, while quietly storing the pile of "later" ideas.
[insert motion animations here]

* **Visuals:** how it looked, but more importantly, how it *felt*. how it behaved when users navigated the screens and lived on their home screens.

i organized everything into P0, P1, and P2 priorities. the pace was intense. i mapped tasks out in Figma and Bear (a markdown note-taking app i love; i'm writing this on it right now), and documented the architecture in Obsidian so i wouldn't lose my foundational clarity.

### Solution (with features)

to keep Align completely frictionless, we structured the experience around 3 clear phases: **Set directions → Do moves → Check in.** **Onboarding:** we needed users to commit to 1-3 directions for a 14-day window right from the start. magic link auth keeps things fast. new users get started instantly; returning users pick up exactly where they left off.
[insert video]

**Setting directions:** after onboarding, you pick what you want to work on. we restricted this to 3 directions maximum to force sharp focus. each direction gets a distinct color (terra, forest, slate) so they're instantly recognizable. users choose a 7 or 14-day window—shorter for quick momentum, longer for deep work.
[insert video]

**The core loop:** each day, users pick up to 3 moves linked to their directions. we kept moves small and concrete. one sitting, doable, done. this constraint of 3 moves per day is enforced everywhere: in the UI, in the client code, and in the database. absolutely no exceptions.
[insert video]

**Doing:** we designed the experience around daily intent. morning and evening are the pivotal moments. the day's moves sit prominently on the Today tab. tapping a move marks it as done—that single, satisfying checkmark is the core feedback loop. each move has exactly two states: pending or done. no partial progress, no complexity. the moment you check it off, it's done. (and yes, you can uncheck it if you made a mistake. honesty over perfection.)
[insert video]

**The check-in:** after 6 PM, we prompt users to check in. did you show up, or did you avoid it? there's no judgment. just pure awareness. this is where the reflection happens. the system tracks *showed_up* vs *avoided*—not streaks, not scores.
[insert video]

**The later pile:** ideas and links that aren't for today go straight into the later pile. they stay there quietly until you explicitly promote them into your window, or drop them entirely. nothing auto-promotes. nothing gets forgotten. you choose consciously.
[insert video]

**The window:** you can see your progress across the entire cycle on the Window tab. each day is a row. past days show your check-in status, today shows your active moves, and future days remain blank. tapping any day reveals exactly what happened.
[insert video]

**Cycle close:** after day 14, the window closes. there's no option to extend it. you write a brief reflection, review your later pile, and then open a brand new window. this is highly intentional. the ending is a vital part of the system. each window stands alone.

*We enforced specific vocabulary everywhere to build this mental model:* cycle (not sprint), window (not schedule), direction (not goal), move (not task), showed_up (not completed), avoided (not failed). the words shape how users think about the practice.
[insert video]

### Impact

after a week of heads-down building, i designed a quick landing page, hit publish, and announced it. we saw over 1,000 impressions on LinkedIn within 12 hours. 

* 200 users in 24 hours.
* 312 within the next week.
* 500+ shortly after.

[insert proofs]

### Feedback from users

Align grew purely through word of mouth. people recommended it to friends who were exhausted by bloated productivity tools and just wanted something simple. 

the constraint of 3 moves per day surprised people. they expected to be able to do more, not less. but the limitation is exactly what freed them. no more deciding what to do—just doing it. users reached out to tell me they were finally finishing things simply because there was nothing else left to distract them. that was the whole point.

[insert pics from friend chats]

### Lessons learnt

Align reinforced a few core truths for me:

* **Less is more.** the first version had more features, more fields, more ways to customize. but users didn't want more. *i* didn’t want more. people want to do the work, not configure the app. we cut everything that wasn't essential. the 14-day window, the 3 daily moves, the 'showed up or avoided' metric. every constraint became our best feature.
* **Constraints create clarity.** i was initially terrified that limiting users to 3 moves a day would feel suffocating. it did the exact opposite. users told me they finally knew what to do because the choice paralysis was gone. the constraint *is* the product.
* **Good design is invisible.** i obsessed over the animations, the paper textures, the typography. but what users actually loved was that Align got out of their way. beautiful design means never having to think about how to use it.
* **Trusting my own judgment.** everyone told me “productivity apps” needed more. more integrations, analytics, social features. i said no. and that "no" is what drove the product forward.
* **Talking to users provides clarity.** when users explain why something works (or doesn't), the next steps become obvious. i built features based on real conversations, not blind hypotheses.
* **Keeping the team lean creates focus.** there's no room for busywork when it's just you. every single hour has to matter.
* **Real progress comes from obsessing over what matters.** i didn't build Align for everyone. i built it for people who genuinely wanted to do the work but kept falling off track. that hyper-focus is why the product works.

### End

Align is still finding its people. there's no grand launch, no viral ad campaign. it’s just the product doing exactly what it was designed to do.

each window starts fresh. each day asks a simple question: *did you show up?*

we've kept it small on purpose. i am a solo team, the features are deliberate, and the constraints remain strict. 

that's the point.
