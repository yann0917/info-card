import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${theme === "light" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <span className="sr-only">切换主题</span>
    </Button>
  )
}