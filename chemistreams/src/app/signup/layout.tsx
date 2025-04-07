
export default function Layout({ children } : Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            {children}
        </div>
    )
}