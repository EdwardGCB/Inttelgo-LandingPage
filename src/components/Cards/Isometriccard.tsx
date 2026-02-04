import React from 'react';
import '@/IsometricCard.css';

interface IsometricCardProps {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    onAction?: () => void;
    actionLabel?: string;
}

const IsometricCard: React.FC<IsometricCardProps> = ({
    title = 'Project Dashboard',
    subtitle = 'Analytics & Insights',
    icon,
    onAction,
    actionLabel = 'View Details'
}) => {
    const defaultIcon = (
        <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ width: '32px', height: '32px' }}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
        </svg>
    );

    return (
        <div className="isometric-container">
            <div className="isometric-card-wrapper">
                <div className="isometric-card">
                    <div className="isometric-card-content">
                        <div className="isometric-card-header">
                            <div className="isometric-card-title-wrapper">
                                <h2 className="isometric-card-title">{title}</h2>
                                <p className="isometric-card-subtitle">{subtitle}</p>
                            </div>

                            <div className="isometric-icon-circle">
                                {icon || defaultIcon}
                            </div>
                        </div>

                        <div className="isometric-card-body">
                            <div className="isometric-content-section">
                                <div className="isometric-content-line w-75"></div>
                                <div className="isometric-content-line w-50"></div>
                            </div>

                            <div className="isometric-content-section">
                                <div className="isometric-content-line w-67"></div>
                                <div className="isometric-content-line w-85"></div>
                            </div>

                            <div className="isometric-content-section">
                                <div className="isometric-content-line w-80"></div>
                                <div className="isometric-content-line w-60"></div>
                            </div>
                        </div>

                        <div className="isometric-card-footer">
                            <button
                                className="isometric-action-button"
                                onClick={onAction}
                            >
                                {actionLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IsometricCard;