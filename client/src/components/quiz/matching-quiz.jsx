import { useState, useEffect, useRef } from "react"
import { CardContent } from "../ui/card"

export default function MatchingQuiz({ data, setScore, setItems }) {
  const [leftItems, setLeftItems] = useState([])
  const [rightItems, setRightItems] = useState([])
  const [selectedLeft, setSelectedLeft] = useState(null)
  const [selectedRight, setSelectedRight] = useState(null)
  const [pairings, setPairings] = useState([])
  const [correctMatches, setCorrectMatches] = useState([])

  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const containerRef = useRef(null)

  useEffect(() => {
    resetGame()
    setItems(data.length)
  }, [])

  // Handle selection of left item
  const handleLeftSelect = (item) => {
    // Don't allow selection of already paired items
    if (pairings.some((pair) => pair.leftId === item.id)) return

    setSelectedLeft(item)

    // If right is already selected, create a pairing
    if (selectedRight) {
      createPairing(item, selectedRight)
    }
  }

  // Handle selection of right item
  const handleRightSelect = (item) => {
    // Don't allow selection of already paired items
    if (pairings.some((pair) => pair.rightId === item.id)) return

    setSelectedRight(item)

    // If left is already selected, create a pairing
    if (selectedLeft) {
      createPairing(selectedLeft, item)
    }
  }

  // Create a pairing between any left and right item
  const createPairing = (left, right) => {
    const newPairing = { leftId: left.id, rightId: right.id }
    setPairings((prev) => [...prev, newPairing])

    if (left.id === right.id) {
      setCorrectMatches((prev) => [...prev, { leftId: left.id, rightId: right.id }])
      setScore(correctMatches.length + 1)
    }

    // reset/clear selection
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  // Reset the f*cking activity 
  const resetGame = () => {
    const shuffledLeft = [...data].sort(() => Math.random() - 0.5)
    const shuffledRight = [...data].sort(() => Math.random() - 0.5)

    setLeftItems(shuffledLeft)
    setRightItems(shuffledRight)
    setSelectedLeft(null)
    setSelectedRight(null)
    setPairings([])
    setCorrectMatches([])
  }

  // Set up refs for each item
  const setLeftRef = (id, element) => {
    leftRefs.current[id] = element
  }

  const setRightRef = (id, element) => {
    rightRefs.current[id] = element
  }

  // Calculate lines for all pairings
  const renderLines = () => {
    if (!containerRef.current) return null

    const containerRect = containerRef.current.getBoundingClientRect()

    return pairings.map((pair) => {
      const leftElement = leftRefs.current[pair.leftId]
      const rightElement = rightRefs.current[pair.rightId]

      if (!leftElement || !rightElement) return null

      const leftRect = leftElement.getBoundingClientRect()
      const rightRect = rightElement.getBoundingClientRect()

      const x1 = leftRect.right - containerRect.left
      const y1 = leftRect.top + leftRect.height / 2 - containerRect.top
      const x2 = rightRect.left - containerRect.left
      const y2 = rightRect.top + rightRect.height / 2 - containerRect.top

      const lineColor = "#6366F1"

      return (
        <line
          key={`line-${pair.leftId}-${pair.rightId}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={lineColor}
          strokeWidth="3"
        />
      )
    })
  }

  return (
    <CardContent>
      <div className="relative flex justify-between h-fit mb-6" ref={containerRef}>
        {/* lep kolom */}
        <div className="flex flex-col gap-4 w-2/5">
          {leftItems.map((item) => (
            <div
              key={`left-${item.id}`}
              ref={(el) => setLeftRef(item.id, el)}
              className={`p-4 rounded-lg flex items-center justify-center text-lg cursor-pointer transition-transform 
                ${
                  pairings.some((pair) => pair.leftId === item.id)
                    ? "bg-purple-100 border-2 border-purple-500"
                    : selectedLeft?.id === item.id
                      ? "bg-red-100 border-2 border-blue-500 shadow-md"
                      : "bg-red-100 shadow"
                }`}
              onClick={() => handleLeftSelect(item)}
            >
              {item.leftItem}
            </div>
          ))}
        </div>

        {/* rayt kolom */}
        <div className="flex flex-col gap-4 w-2/5">
          {rightItems.map((item) => (
            <div
              key={`right-${item.id}`}
              ref={(el) => setRightRef(item.id, el)}
              className={`p-4 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-transform
                ${
                  pairings.some((pair) => pair.rightId === item.id)
                    ? "bg-purple-100 border-2 border-purple-500"
                    : selectedRight?.id === item.id
                      ? "bg-green-100 border-2 border-blue-500 shadow-md"
                      : "bg-green-100 shadow"
                }`}
              onClick={() => handleRightSelect(item)}
            >
              {item.rightItem}
            </div>
          ))}
        </div>

        {/* the greaaaaaat line HAHA */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">{renderLines()}</svg>
      </div>
      {/* <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition-colors"
        onClick={resetGame}
      >
        Reset Game
      </button> */}
    </CardContent>
  )
}
