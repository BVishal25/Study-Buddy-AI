import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location, navigate] = useLocation();

  const navigationItems = [
    {
      title: "Learning Hub",
      items: [
        { 
          name: "Dashboard", 
          icon: "fas fa-home", 
          path: "/",
          active: location === "/"
        },
        { 
          name: "My Learning Path", 
          icon: "fas fa-route", 
          path: "/learning-path",
          active: location === "/learning-path"
        },
        { 
          name: "Knowledge Graph", 
          icon: "fas fa-project-diagram", 
          path: "/knowledge-graph",
          active: location === "/knowledge-graph"
        },
        { 
          name: "AI Tutor", 
          icon: "fas fa-robot", 
          path: "/ai-tutor",
          active: location === "/ai-tutor"
        },
      ]
    },
    {
      title: "Practice Arena",
      items: [
        { 
          name: "Sandbox", 
          icon: "fas fa-code", 
          path: "/sandbox",
          active: location === "/sandbox"
        },
        { 
          name: "Projects", 
          icon: "fas fa-tasks", 
          path: "/projects",
          active: location === "/projects"
        },
        { 
          name: "Challenges", 
          icon: "fas fa-trophy", 
          path: "/challenges",
          active: location === "/challenges"
        },
      ]
    },
    {
      title: "Research Hub",
      items: [
        { 
          name: "Trending Papers", 
          icon: "fas fa-newspaper", 
          path: "/papers",
          active: location === "/papers"
        },
        { 
          name: "Innovation Lab", 
          icon: "fas fa-lightbulb", 
          path: "/innovation",
          active: location === "/innovation"
        },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed left-0 h-full overflow-y-auto pt-16">
      <div className="p-6">
        {/* Progress Overview */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Progress</h3>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-2">
            <Progress value={68} className="h-2" />
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>34 topics completed</span>
            <span>68%</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.active
                        ? "text-primary bg-primary/10 dark:bg-primary/20"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <i className={cn(item.icon, "mr-3 text-sm")}></i>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
