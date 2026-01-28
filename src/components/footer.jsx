export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Top Section */}
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-white">
                        ReactJS Pagination Project
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        A practical demonstration of API-based pagination
                        using modern React practices and Tailwind CSS.
                    </p>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-700"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    
                    <p className="text-center md:text-left">
                        © {currentYear} Rahul Kesarwani. All rights reserved.
                    </p>

                    <p className="text-center md:text-right text-gray-400">
                        Assistant Professor, CSE • UCER, Prayagraj
                    </p>
                </div>
            </div>
        </footer>
    );
}
