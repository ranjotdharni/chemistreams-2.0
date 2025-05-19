import { DropListProps } from "@/lib/types/props"

export default function DropList<T>({ open, TitleComponent, items, render, containerTailwind, height } : DropListProps<T>) {

    return (
        <div className={containerTailwind}>
            {
                TitleComponent
            }
            
            <ul className="rounded p-2 relative" style={{height: open ? height : 0, opacity: open ? 1 : 0, top: open ? 0 : -10, transition: "all 0.25s ease-in-out", overflowX: "hidden", overflowY: "scroll", backgroundColor: "var(--color-black)", border: "solid 1px var(--color-dark-grey)"}}>
                {
                    items.map((item, index) => {
                        return render(item, index)
                    })
                }
            </ul>
        </div>
    )
}
