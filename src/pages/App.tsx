import { Box, Button, Text, Input, Checkbox, Flex } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'

import { Header } from '~components/Header'
import { ls } from '~utils/localStorage'

import oldChurchBell from '/old-church-bell.wav'

interface ITimerDefaults {
    lectioDefaultDuration: number
    lectioTimerDisabled: boolean
    meditatioDefaultDuration: number
    oratioDefaultDuration: number
    contemplatioDefaultDuration: number
    contemplatioTimerDisabled: boolean
}

const defaultDuration = 5

const defaultDurations = {
    lectioDefaultDuration: defaultDuration,
    lectioTimerDisabled: false,
    meditatioDefaultDuration: defaultDuration,
    oratioDefaultDuration: defaultDuration,
    contemplatioDefaultDuration: defaultDuration,
    contemplatioTimerDisabled: false,
}
const LS_DEFAULT_DURATIONS_KEY = 'DEFAULT_DURATIONS'

export const App = (): JSX.Element => {
    const [isTimerActive, setIsTimerActive] = useState(false)
    const lectioTimerInput = useRef<HTMLInputElement | null>(null)
    const meditatioTimerInput = useRef<HTMLInputElement | null>(null)
    const oratioTimerInput = useRef<HTMLInputElement | null>(null)
    const contemplatioTimerInput = useRef<HTMLInputElement | null>(null)
    const [playBell] = useSound(oldChurchBell)
    const [isLectioTimerDisabled, setIsLectioTimerDisabled] = useState(false)
    const [isContemplatioDisabled, setIsContemplatioDisabled] = useState(false)
    const [timerDefaults, setTimerDefaults] = useState<ITimerDefaults | undefined>()
    const segmentTimerCounts = useRef<number[]>([])

    const getDefaultDurations = () => JSON.parse(ls.get(LS_DEFAULT_DURATIONS_KEY) ?? JSON.stringify(defaultDurations))

    const getTimerDefaults = () => {
        const fetchedTimerDefaults = getDefaultDurations()
        setTimerDefaults(fetchedTimerDefaults)
        setIsLectioTimerDisabled(fetchedTimerDefaults.lectioTimerDisabled)
        setIsContemplatioDisabled(fetchedTimerDefaults.contemplatioTimerDisabled)
    }

    useEffect(() => {
        getTimerDefaults()
    }, [])

    const updateDefaults = (key: string, value?: string | number | boolean) => {
        const fetchedTimerDefaults = getDefaultDurations()
        fetchedTimerDefaults[key] = value
        ls.set(LS_DEFAULT_DURATIONS_KEY, JSON.stringify(fetchedTimerDefaults))
    }

    const toggleLectioTimer = () => {
        const timerDisabled = !isLectioTimerDisabled
        updateDefaults('lectioTimerDisabled', timerDisabled)
        setIsLectioTimerDisabled(timerDisabled)
    }

    const toggleContemplatioTimer = () => {
        const timerDisabled = !isContemplatioDisabled
        updateDefaults('contemplatioTimerDisabled', timerDisabled)
        setIsContemplatioDisabled(timerDisabled)
    }

    const getTimers = () => {
        segmentTimerCounts.current = []
        if (!isLectioTimerDisabled) segmentTimerCounts.current.push(Number(lectioTimerInput.current?.value || 5))
        segmentTimerCounts.current.push(Number(meditatioTimerInput.current?.value || 5))
        segmentTimerCounts.current.push(Number(oratioTimerInput.current?.value || 5))
        if (!isContemplatioDisabled) segmentTimerCounts.current.push(Number(contemplatioTimerInput.current?.value || 5))
    }

    const startTimers = () => {
        getTimers()
        let cumulativeTimerCount = 0
        segmentTimerCounts.current.forEach((timerCount, index) => {
            const timerMinutes = 1000 * 60 * timerCount
            setTimeout(() => {
                playBell()
                if (index + 1 === segmentTimerCounts.current.length) setIsTimerActive(false)
            }, timerMinutes + cumulativeTimerCount)
            cumulativeTimerCount += timerMinutes
        })
        setIsTimerActive(true)
    }

    if (timerDefaults === undefined) {
        return (
            <Box p="2">
                <Header title="Lectio Divina Timer">
                    <></>
                </Header>
            </Box>
        )
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
                                        defaultValue={timerDefaults.lectioDefaultDuration}
                                        placeholder={'Input the number of minutes'}
                                        ref={lectioTimerInput}
                                        onChange={() =>
                                            updateDefaults(
                                                'lectioDefaultDuration',
                                                lectioTimerInput?.current?.value || defaultDuration,
                                            )
                                        }
                                    />
                                </>
                            )}
                            <Checkbox mt="16px" isChecked={isLectioTimerDisabled} onChange={() => toggleLectioTimer()}>
                                {isLectioTimerDisabled ? 'En' : 'Dis'}able Lectio Timer
                            </Checkbox>
                            <Text mb="8px" mt="16px">
                                Meditatio (minutes)
                            </Text>
                            <Input
                                defaultValue={Number(timerDefaults.meditatioDefaultDuration)}
                                placeholder={'Input the number of minutes'}
                                ref={meditatioTimerInput}
                                onChange={() =>
                                    updateDefaults(
                                        'meditatioDefaultDuration',
                                        meditatioTimerInput?.current?.value || defaultDuration,
                                    )
                                }
                            />
                            <Text mb="8px" mt="16px">
                                Oratio (minutes)
                            </Text>
                            <Input
                                defaultValue={timerDefaults.oratioDefaultDuration}
                                placeholder={'Input the number of minutes'}
                                ref={oratioTimerInput}
                                onChange={() =>
                                    updateDefaults(
                                        'oratioDefaultDuration',
                                        oratioTimerInput?.current?.value || defaultDuration,
                                    )
                                }
                            />
                            {!isContemplatioDisabled && (
                                <>
                                    <Text mb="8px" mt="16px">
                                        Contemplatio (minutes)
                                    </Text>
                                    <Input
                                        defaultValue={timerDefaults.contemplatioDefaultDuration}
                                        placeholder={'Input the number of minutes'}
                                        ref={contemplatioTimerInput}
                                        onChange={() =>
                                            updateDefaults(
                                                'contemplatioDefaultDuration',
                                                contemplatioTimerInput?.current?.value || defaultDuration,
                                            )
                                        }
                                    />
                                </>
                            )}
                            <Checkbox
                                mt="16px"
                                isChecked={isContemplatioDisabled}
                                onChange={() => toggleContemplatioTimer()}
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
