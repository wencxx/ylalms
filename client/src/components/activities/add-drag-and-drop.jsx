import { CardContent } from "../ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function AddDragAndDrop() {

    // add container
    const [containers, setContainer] = useState([]);
    const [currentContainer, setCurrentContainer] = useState('')

    const addContainer = () => {
        const existingContainer = containers.find((container) => container.container.toLowerCase() === currentContainer.toLowerCase())

        if (existingContainer) {
            return alert('Container already exist.')
        }
        const newContainer = {
            container: currentContainer,
            items: []
        }
        setContainer((prev) => [...prev, newContainer])
        setCurrentContainer('')
    }


    // add item
    const [item, setItem] = useState('')
    const [belongTo, setBelongsTo] = useState('')

    const addItem = () => {
        setContainer((prevContainers) =>
            prevContainers.map((container) =>
                container.container === belongTo
                    ? { ...container, items: [...container.items, item] }
                    : container
            )
        );
        setItem('')
        setBelongsTo('')
    }

    // remove container
    const removeContainer = (indexToRemove) => {
        const mappedContainers = containers.filter((container, index) => index !== indexToRemove)
        setContainer(mappedContainers)
    }

    return (
        <>
            <CardContent className="space-y-8">
                <div className="space-y-2">
                    <Label className="text-md">Activity Name</Label>
                    <Input
                        className="border-purple-500 bg-white"
                        placeholder="Enter activity name"
                    />
                </div>
                {/* container part hereee */}
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="space-y-2 w-full lg:w-1/2">
                            <Label className="text-md">Container</Label>
                            <Input
                                className="border-purple-500 bg-white"
                                placeholder="e.g., Animals"
                                value={currentContainer}
                                onChange={(e) => setCurrentContainer(e.target.value)}
                            />
                            <Button
                                className="w-full bg-violet-500 hover:bg-violet-500/80 mt-2"
                                onClick={() => addContainer()}
                            >
                                <Plus />
                                Add Container
                            </Button>
                        </div>
                        <div className="space-y-2 w-full lg:w-1/2">
                            <Label className="text-md">Containers</Label>
                            <div className="border border-purple-500 min-h-30 lg:min-h-22 rounded-md bg-white p-2 flex flex-wrap gap-2">
                                {containers.map((container, index) => (
                                    <Badge key={index} className="h-fit bg-pink-500 cursor-pointer" onDoubleClick={() => removeContainer(index)}>{container.container}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* item part hereeee */}
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="space-y-2 w-full lg:w-1/2">
                            <Label className="text-md">Item</Label>
                            <Input
                                className="border-purple-500 bg-white"
                                placeholder="e.g., Dog"
                                value={item}
                                onChange={(e) => setItem(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 w-full lg:w-1/2">
                            <Label className="text-md">Belongs to</Label>
                            <Select onValueChange={(value) => setBelongsTo(value)} value={belongTo}>
                                <SelectTrigger className="w-full border-purple-500 bg-white">
                                    <SelectValue placeholder="Select Container" />
                                </SelectTrigger>
                                <SelectContent>
                                    {containers.length ? (
                                        containers.map((container, index) => (
                                            <SelectItem key={index} value={container.container}>{container.container}</SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem disabled>Add container first</SelectItem>

                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        className="w-full bg-red-400 hover:bg-red-400/80 mt-2"
                        onClick={() => addItem()}
                    >
                        <Plus />
                        Add Item
                    </Button>
                </div>
                {containers.length && containers.some((container) => container.items.length) ?  (
                    <div className="space-y-2">
                        <h1>Items</h1>
                        <div className="bg-white border border-purple-500 rounded-md p-3 flex flex-wrap gap-5">
                            {containers.map((container, index) => (
                                container.items.length > 0 && (
                                    <div key={index} className="bg-orange-400 p-2 rounded text-white">
                                        <h4>{container.container}</h4>
                                        <ul className="list-disc pl-4">
                                            {container.items.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No items to show.</p>
                )}
            </CardContent>
        </>
    );
}

export default AddDragAndDrop;