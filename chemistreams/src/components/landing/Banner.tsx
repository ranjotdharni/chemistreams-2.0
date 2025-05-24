import { PAGE_LOGIN, PAGE_SIGNUP } from "@/lib/constants/routes"
import styles from "../../css/Typewriter.module.css"

export default function Banner() {

    return (
        <section className="fixed top-[20vh] left-0 w-screen h-[70vh] flex flex-row items-center">
            <div className="w-1/2 h-full flex flex-col items-center space-y-8">
                <div className="relative w-[62.5%]">
                    <h1 className={`${styles.typewriter} text-dark-white font-jbm text-4xl`}>Messaging Made Easy</h1>
                </div>

                <div className="bg-black rounded-lg w-3/4 h-3/4 shadow-xl flex flex-col justify-center items-center">
                    <img src="https://res.cloudinary.com/dm9lygtbe/image/upload/v1747994561/bannerShot_qsqpxg.png" className="h-full aspect-square" alt="Banner Shot" width={500} height={500} />
                </div>

                <div className="w-3/4 flex flex-row justify-end space-x-4">
                    <a href={PAGE_SIGNUP} className="font-lato text-white text-md bg-black px-6 py-1 rounded hover:cursor-pointer">Sign Up</a>
                    <a href={PAGE_LOGIN} className="font-lato text-white text-md bg-green px-6 py-1 rounded hover:cursor-pointer">Log In</a>
                </div>
            </div>
            <iframe src='https://my.spline.design/genkubgreetingrobot-PomjdePZwJfkfLW2nXv3yTn8/' width='50%' height='100%'></iframe>
        </section>
    )
}
