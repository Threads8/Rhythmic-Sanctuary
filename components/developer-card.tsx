"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Heart } from "lucide-react"

export function DeveloperCard() {
  const handleContact = () => {
    const email = "gdg.arcade.rahul.290901@gmail.com"
    const subject = encodeURIComponent("Feedback for Your App")
    const body = encodeURIComponent(`Hi Rahul,

I hope you're doing well. I wanted to reach out regarding your app.

[Write your message here]

Thanks & regards,`)
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-lg border-none shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 dark:from-pink-950/40 dark:via-rose-900/40 dark:to-orange-950/40 w-full relative" />
        
        <CardContent className="px-8 pb-10 pt-0 flex flex-col items-center text-center relative">
          <div className="w-32 h-32 rounded-full p-2 bg-white dark:bg-slate-900 shadow-xl -mt-16 mb-6 relative z-10 transition-transform duration-500 hover:scale-105">
            <img 
              src="https://res.cloudinary.com/dpjdnoqii/image/upload/v1765538072/20251116_122306_1_svilxg.jpg" 
              alt="Developer Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          
          <h2 className="text-2xl font-extrabold text-[#1e293b] dark:text-slate-100 mb-2">
            Meet the Developer
          </h2>
          
          <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-2xl mb-8 relative">
            <p className="text-sm font-medium leading-relaxed">
              "Hi there <Heart className="w-3 h-3 inline-block fill-current" /> <br/>
              I hope you're doing well. I'm Rahul, the developer of this app.<br/>
              I built this to support and empower you through your journey.<br/>
              If you ever have feedback, suggestions, or just want to connect, feel free to reach out!"
            </p>
          </div>
          
          <Button 
            onClick={handleContact}
            className="w-full sm:w-auto px-8 h-12 bg-[#8c494b] hover:bg-[#733b3d] dark:bg-gradient-to-r dark:from-pink-500/80 dark:to-purple-500/80 dark:hover:from-pink-500 dark:hover:to-purple-500 dark:shadow-[0_0_15px_rgba(236,72,153,0.3)] dark:border-0 text-white rounded-xl shadow-md transition-all gap-2 group"
          >
            <Mail className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="font-semibold">Contact Developer</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
