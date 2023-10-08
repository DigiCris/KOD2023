import { useMediaQuery } from '@chakra-ui/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import '../assets/Timer.css';

const Countdown = (props) => {
    const [isLargerThan1000] = useMediaQuery('(min-width: 1000px)');
    const [isSmallerThan800] = useMediaQuery('(max-width: 799px)');
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    function mapNumber(number, in_min, in_max, out_min, out_max) {
        return (
            ((number - in_min) * (out_max - out_min)) / (in_max - in_min) +
            out_min
        );
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

        var d = [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            largeArcFlag,
            0,
            end.x,
            end.y,
        ].join(' ');

        return d;
    }

    const SVGCircle = ({ radius }) => (
        <svg
            viewBox="0 0 110 110"
            className={
                isLargerThan1000 ? 'countdown-svg' : 'tablet-countdown-svg'
            }
        >
            <path
                fill="none"
                stroke={isSmallerThan800 ? '#ccc' : '#333'}
                stroke-width="3"
                d={describeArc(50, 50, 48, 0, radius)}
            />
        </svg>
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const { timeTillDate, timeFormat } = props;
            const then = moment(timeTillDate, timeFormat);
            const now = moment();
            const countdown = moment(then - now);
            const days = countdown.format('D');
            const hours = countdown.format('HH');
            const minutes = countdown.format('mm');
            const seconds = countdown.format('ss');

            setDays(days);
            setHours(hours);
            setMinutes(minutes);
            setSeconds(seconds);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [props]);

    if (!seconds) {
        return null;
    }

    return isSmallerThan800 ? (
        <>
            <div style={{ width: '100%', height: '94px' }}></div>
            <div className="mobileContainer">
                <h1>Cuenta Regresiva</h1>
                <div className="clockContainer">
                    {days && (
                        <div
                            className={
                                isLargerThan1000
                                    ? 'countdown-item'
                                    : 'tablet-countdown-item'
                            }
                        >
                            <SVGCircle
                                radius={mapNumber(days, 30, 0, 0, 360)}
                            />
                            {days}
                            <span>días</span>
                        </div>
                    )}
                    {hours && (
                        <div
                            className={
                                isLargerThan1000
                                    ? 'countdown-item'
                                    : 'tablet-countdown-item'
                            }
                        >
                            <SVGCircle
                                radius={mapNumber(hours, 24, 0, 0, 360)}
                            />
                            {hours}
                            <span>horas</span>
                        </div>
                    )}
                    {minutes && (
                        <div
                            className={
                                isLargerThan1000
                                    ? 'countdown-item'
                                    : 'tablet-countdown-item'
                            }
                        >
                            <SVGCircle
                                radius={mapNumber(minutes, 60, 0, 0, 360)}
                            />
                            {minutes}
                            <span>minutos</span>
                        </div>
                    )}
                    {seconds && (
                        <div
                            className={
                                isLargerThan1000
                                    ? 'countdown-item'
                                    : 'tablet-countdown-item'
                            }
                        >
                            <SVGCircle
                                radius={mapNumber(seconds, 60, 0, 0, 360)}
                            />
                            {seconds}
                            <span>segundos</span>
                        </div>
                    )}
                </div>
            </div>
        </>
    ) : (
        <div>
            <h1>Cuenta Regresiva</h1>
            <div
                className={
                    isLargerThan1000
                        ? 'countdown-wrapper'
                        : 'tablet-countdown-wrapper'
                }
            >
                {days && (
                    <div
                        className={
                            isLargerThan1000
                                ? 'countdown-item'
                                : 'tablet-countdown-item'
                        }
                    >
                        <SVGCircle radius={mapNumber(days, 30, 0, 0, 360)} />
                        {days}
                        <span>días</span>
                    </div>
                )}
                {hours && (
                    <div
                        className={
                            isLargerThan1000
                                ? 'countdown-item'
                                : 'tablet-countdown-item'
                        }
                    >
                        <SVGCircle radius={mapNumber(hours, 24, 0, 0, 360)} />
                        {hours}
                        <span>horas</span>
                    </div>
                )}
            </div>
            <div
                className={
                    isLargerThan1000
                        ? 'countdown-wrapper'
                        : 'tablet-countdown-wrapper'
                }
            >
                {minutes && (
                    <div
                        className={
                            isLargerThan1000
                                ? 'countdown-item'
                                : 'tablet-countdown-item'
                        }
                    >
                        <SVGCircle radius={mapNumber(minutes, 60, 0, 0, 360)} />
                        {minutes}
                        <span>minutos</span>
                    </div>
                )}
                {seconds && (
                    <div
                        className={
                            isLargerThan1000
                                ? 'countdown-item'
                                : 'tablet-countdown-item'
                        }
                    >
                        <SVGCircle radius={mapNumber(seconds, 60, 0, 0, 360)} />
                        {seconds}
                        <span>segundos</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Countdown;
