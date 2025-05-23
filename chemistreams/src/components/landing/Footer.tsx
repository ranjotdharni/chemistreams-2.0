
export default function Footer() {
    const footerItems = [
        {
            link: "https://github.com/ranjotdharni",
            text: "GitHub"
        },
        {
            link: "https://ranjotdharni.netlify.app",
            text: "Portfolio"
        },
        {
            link: "https://icons8.com",
            text: "Icons8"
        },
        {
            link: "https://app.spline.design/community/file/8cfb6748-f3dd-44dd-89fb-f46c7ab4186e",
            text: "Spline"
        },
        {
            link: "https://www.reddit.com/r/webdev/comments/oqvsrj/chatapp_react_portfolio_project_live_link_source/",
            text: "Design"
        }
    ]

    return (
        <footer className="fixed top-[90vh] left-0 w-full h-[10vh] bg-black border-t border-dark-grey flex flex-row justify-center items-center space-x-8">
            {
                footerItems.map((item, index) => {
                    return <a key={`LANDING_FOOTER_ITEM_${index}`} href={item.link} target="_blank" className="hover:cursor-pointer hover:text-green text-light-grey underline font-lato">{item.text}</a>
                })
            }
        </footer>
    )
}
