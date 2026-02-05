import React from 'react';

interface GeminiStarProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    className?: string;
}

const GeminiStar: React.FC<GeminiStarProps> = ({
    size = "1em",
    className = "",
    ...props
}) => {
    return (
        <svg
            height={size}
            width={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flex: "none", lineHeight: 1 }}
            className={className}
            {...props}
        >

            {/* Base naranja oscuro */}
            <path
                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                fill="#EC5406"
            />

            {/* Gradiente verde */}
            <path
                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                fill="url(#gemini-star-fill-0)"
            />

            {/* Gradiente rojo */}
            <path
                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                fill="url(#gemini-star-fill-1)"
            />

            {/* Gradiente amarillo */}
            <path
                d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z"
                fill="url(#gemini-star-fill-2)"
            />

            <defs>
                {/* Gradiente amarillo */}
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="gemini-star-fill-0"
                    x1="7"
                    x2="11"
                    y1="15.5"
                    y2="12"
                >
                    <stop stopColor="#FABC12" />
                    <stop offset="1" stopColor="#FABC12" stopOpacity="0" />
                </linearGradient>

                {/* Gradiente naranja */}
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="gemini-star-fill-1"
                    x1="8"
                    x2="11.5"
                    y1="5.5"
                    y2="11"
                >
                    <stop stopColor="#FF9900" />
                    <stop offset="1" stopColor="#FF9900" stopOpacity="0" />
                </linearGradient>

                {/* Gradiente amarillo a naranja oscuro */}
                <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="gemini-star-fill-2"
                    x1="3.5"
                    x2="17.5"
                    y1="13.5"
                    y2="12"
                >
                    <stop stopColor="#FABC12" />
                    <stop offset="0.5" stopColor="#FF9900" />
                    <stop offset="1" stopColor="#EC5406" stopOpacity="0.8" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default GeminiStar;