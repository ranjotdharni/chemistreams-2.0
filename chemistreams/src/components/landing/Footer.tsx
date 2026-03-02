
export default function Footer() {
    const footerItems = [
        {
            link: "https://icons8.com",
            text: "Icons8"
        },
        {
            link: "https://spline.design/",
            text: "Spline"
        },
        {
            link: "https://github.com/ranjotdharni/",
            text: "GitHub"
        },
        {
            link: "https://ranjotdharni.netlify.app/",
            text: "Portfolio"
        },
        {
            link: "https://www.linkedin.com/in/ranjot-dharni-717580269/",
            text: "LinkedIn"
        },
    ]

    return (
        <footer className="w-full h-[10vh] bg-black border-t border-dark-grey flex flex-row justify-center items-center space-x-8">
            {
                footerItems.map((item, index) => {
                    return <a key={`LANDING_FOOTER_ITEM_${index}`} href={item.link} target="_blank" className="hover:cursor-pointer hover:text-green text-light-grey underline font-lato">{item.text}</a>
                })
            }
        </footer>
    )
}
