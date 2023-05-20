import { Box, Button, Text, Input, Checkbox, Flex } from '@chakra-ui/react'
import { RefObject, useEffect, useRef, useState } from 'react'
import useSound from 'use-sound'

import { Header } from '~components/Header'
import { ls } from '~utils/localStorage'

import oldChurchBell from '/old-church-bell.wav'

interface IDefaultDurations {
    lectioDefaultDuration: number
    meditatioDefaultDuration: number
    oratioDefaultDuration: number
    contemplatioDefaultDuration: number
}

const defaultDuration = 5

const defaultDurations = {
    lectioDefaultDuration: defaultDuration,
    meditatioDefaultDuration: defaultDuration,
    oratioDefaultDuration: defaultDuration,
    contemplatioDefaultDuration: defaultDuration,
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
    const [timerDefaults, setTimerDefaults] = useState<IDefaultDurations | undefined>()
    const segmentTimerCounts = useRef<number[]>([])

    const getDefaultDurations = () => JSON.parse(ls.get(LS_DEFAULT_DURATIONS_KEY) ?? JSON.stringify(defaultDurations))

    const getTimerDefaults = () => {
        const fetchedTimerDefaults = getDefaultDurations()
        setTimerDefaults(fetchedTimerDefaults)
    }

    useEffect(() => {
        getTimerDefaults()
    }, [])

    const updateDefaults = (key: string, element: RefObject<HTMLInputElement>) => {
        const fetchedTimerDefaults = getDefaultDurations()
        fetchedTimerDefaults[key] = element?.current?.value || defaultDuration
        ls.set(LS_DEFAULT_DURATIONS_KEY, JSON.stringify(fetchedTimerDefaults))
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
                                        onChange={() => updateDefaults('lectioDefaultDuration', lectioTimerInput)}
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
                                defaultValue={Number(timerDefaults.meditatioDefaultDuration)}
                                placeholder={'Input the number of minutes'}
                                ref={meditatioTimerInput}
                                onChange={() => updateDefaults('meditatioDefaultDuration', meditatioTimerInput)}
                            />
                            <Text mb="8px" mt="16px">
                                Oratio (minutes)
                            </Text>
                            <Input
                                defaultValue={timerDefaults.oratioDefaultDuration}
                                placeholder={'Input the number of minutes'}
                                ref={oratioTimerInput}
                                onChange={() => updateDefaults('oratioDefaultDuration', oratioTimerInput)}
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
                                            updateDefaults('contemplatioDefaultDuration', contemplatioTimerInput)
                                        }
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
