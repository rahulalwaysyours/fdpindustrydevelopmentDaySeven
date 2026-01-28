export default function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">
            <div className="max-w-7xl mx-auto px-6 py-14 text-center">
                
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
                    Hi, I am Rahul Kesarwani
                </h1>

                {/* Subtitle */}
                <p className="mt-2 text-lg md:text-xl text-blue-100">
                    Assistant Professor, Computer Science & Engineering  
                    <br />
                    United College of Engineering & Research (UCER), Prayagraj
                </p>

                {/* Divider */}
                <div className="w-24 h-1 bg-white/70 mx-auto my-6 rounded"></div>

                {/* Project Description */}
                <p className="max-w-3xl mx-auto text-base md:text-lg leading-relaxed text-blue-50">
                    Welcome to this project demonstration on{" "}
                    <span className="font-semibold text-white">
                        ReactJS Pagination using API integration
                    </span>.
                    This application showcases modern React practices including
                    component-based architecture, server-side pagination,
                    secure API consumption using API keys, and responsive UI
                    design with Tailwind CSS.
                </p>

                {/* Highlight Badge */}
                <div className="mt-6 flex justify-center">
                    <span className="px-5 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                        React • API Pagination • Tailwind CSS • Secure API Key Usage
                    </span>
                </div>
            </div>
        </header>
    );
}
