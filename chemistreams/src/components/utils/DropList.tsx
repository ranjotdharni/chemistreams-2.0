import { DropListProps } from "@/lib/types/props"

export default function DropList<T>({ open, TitleComponent, items, render, containerTailwind, height, maxHeight } : DropListProps<T>) {

    return (
        <div className={containerTailwind}>
            {
                TitleComponent
            }
            
            <ul className="rounded p-2 relative" style={{height: open ? height : 0, maxHeight: maxHeight, opacity: open ? 1 : 0, transform: open ? "translateY(0px)" : "translateY(-10px)", transition: "all 0.2s ease-in-out", overflowX: "hidden", overflowY: open ? "scroll" : "hidden", backgroundColor: "var(--color-black)", border: "solid 1px var(--color-dark-grey)"}}>
                {
                    items.map((item, index) => {
                        return render(item, index)
                    })
                }
            </ul>
        </div>
    )
}
