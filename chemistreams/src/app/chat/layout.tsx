
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <section className="w-full h-full flex flex-col justify-center items-center">
            { children }
        </section>
    )
}
