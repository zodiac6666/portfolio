// src/components/layout/Footer.jsx
import { ExternalLink, GitFork, Mail, Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#2E3340] bg-[#0B0C10]">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-mono text-sm text-[#14B8A6] font-medium">YahyaBaji</p>
          <p className="text-[#6B7280] text-sm mt-1">Full-Stack Developer, always learning.</p>
        </div>

        <p className="text-[#6B7280] text-xs text-center">
          <span className="block mt-1">&copy; {new Date().getFullYear()} YahyaBaji</span>
        </p>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors p-2 rounded-md hover:bg-[#1A1D26]"
          >
            <GitFork size={18} />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors p-2 rounded-md hover:bg-[#1A1D26]"
          >
            <ExternalLink size={18} />
          </a>
          <a
            href="mailto:yahyabaji0374@gmail.com"
            aria-label="Email"
            className="text-[#6B7280] hover:text-[#E8E9ED] transition-colors p-2 rounded-md hover:bg-[#1A1D26]"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>

      <div className="border-t border-[#2E3340] py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <p className="text-[#6B7280] text-xs">
            Open to full-stack opportunities
          </p>
          <a
            href="/admin/login"
            className="text-[#6B7280]/50 hover:text-[#6B7280] text-xs transition-colors flex items-center gap-1"
            aria-label="Admin login"
          >
            <Shield size={12} />
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}