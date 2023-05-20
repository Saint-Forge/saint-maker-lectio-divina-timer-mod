import { Box, Button, Text, Input, Checkbox, Flex } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import useSound from 'use-sound'

import { Header } from '~components/Header'

import oldChurchBell from '/old-church-bell.wav'

export const App = (): JSX.Element => {
    const [isTimerActive, setIsTimerActive] = useState(false)
    const lectioTimerInput = useRef<HTMLInputElement | null>(null)
    const meditatioTimerInput = useRef<HTMLInputElement | null>(null)
    const oratioTimerInput = useRef<HTMLInputElement | null>(null)
    const contemplatioTimerInput = useRef<HTMLInputElement | null>(null)
    const [playBell] = useSound(oldChurchBell)
    const [isLectioTimerDisabled, setIsLectioTimerDisabled] = useState(false)
    const [isContemplatioDisabled, setIsContemplatioDisabled] = useState(false)
    const timers = useRef<number[]>([])

    const getTimers = () => {
        timers.current = []
        if (!isLectioTimerDisabled) timers.current.push(Number(lectioTimerInput.current?.value || 5))
        timers.current.push(Number(meditatioTimerInput.current?.value || 5))
        timers.current.push(Number(oratioTimerInput.current?.value || 5))
        if (!isContemplatioDisabled) timers.current.push(Number(contemplatioTimerInput.current?.value || 5))
    }

    const startTimers = () => {
        getTimers()
        let cumulativeTimerCount = 0
        timers.current.forEach((timerCount, index) => {
            const timerMinutes = 1000 * 60 * timerCount
            setTimeout(() => {
                playBell()
                if (index + 1 === timers.current.length) setIsTimerActive(false)
            }, timerMinutes + cumulativeTimerCount)
            cumulativeTimerCount += timerMinutes
        })
        setIsTimerActive(true)
    }

    return (
        <Box p="2">
            <Header title="Lectio Divina Timer">
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="2" mt="2">
                    <Flex direction="column" alignItems="center">
                        <Flex direction="column" pb="2" maxW="328px" w="100%">
                            {!isLectioTimerDisabled && (
                                <>
                                    <Text mb="8px" mt="16px">
                                        Lectio (minutes)
                                    </Text>
                                    <Input
                                        defaultValue={5}
                                        placeholder={'Input the number of minutes'}
                                        ref={lectioTimerInput}
                                    />
                                </>
                            )}
                            <Checkbox
                                mt="16px"
                                isChecked={isLectioTimerDisabled}
                                onChange={() => setIsLectioTimerDisabled(!isLectioTimerDisabled)}
                            >
                                {isLectioTimerDisabled ? 'En' : 'Dis'}able Lectio Timer
                            </Checkbox>
                            <Text mb="8px" mt="16px">
                                Meditatio (minutes)
                            </Text>
                            <Input
                                defaultValue={5}
                                placeholder={'Input the number of minutes'}
                                ref={meditatioTimerInput}
                            />
                            <Text mb="8px" mt="16px">
                                Oratio (minutes)
                            </Text>
                            <Input
                                defaultValue={5}
                                placeholder={'Input the number of minutes'}
                                ref={oratioTimerInput}
                            />
                            {!isContemplatioDisabled && (
                                <>
                                    <Text mb="8px" mt="16px">
                                        Contemplatio (minutes)
                                    </Text>
                                    <Input
                                        defaultValue={5}
                                        placeholder={'Input the number of minutes'}
                                        ref={contemplatioTimerInput}
                                    />
                                </>
                            )}
                            <Checkbox
                                mt="16px"
                                isChecked={isContemplatioDisabled}
                                onChange={() => setIsContemplatioDisabled(!isContemplatioDisabled)}
                            >
                                {isContemplatioDisabled ? 'En' : 'Dis'}able Contemplatio Timer
                            </Checkbox>
                            <Box display="flex" justifyContent="flex-end">
                                {isTimerActive ? (
                                    <Button onClick={() => setIsTimerActive(false)}>Reset</Button>
                                ) : (
                                    <Button onClick={startTimers}>Start</Button>
                                )}
                            </Box>
                        </Flex>
                    </Flex>
                </Box>
            </Header>
        </Box>
    )
}
