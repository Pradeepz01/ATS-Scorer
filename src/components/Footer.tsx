"use client";


export default function Footer() {
    return (
        <footer className="w-full py-4 mt-8 border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="container mx-auto flex justify-center items-center">
                <a
                    href="https://www.linkedin.com/in/pradeep-s06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
                >
                    <span>Contact Owner: Pradeep</span>
                </a>
            </div>
        </footer>
    );
}
