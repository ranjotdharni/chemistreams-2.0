import styles from "../../css/Loader.module.css"


export default function Loader({ containerTailwind } : { containerTailwind: string }) {
    return (
        <div className={containerTailwind}>
            <div className={styles.loader}>
                <div className={`${styles.dot} ${styles.dot1}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot2}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot3}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot4}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot5}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot6}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot7}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot8}`}><i></i></div>
                <div className={`${styles.dot} ${styles.dot9}`}><i></i></div>
            </div>
        </div>
    )
}
