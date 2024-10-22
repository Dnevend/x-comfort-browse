export const createButton = (id?: string) => {
    const button = document.createElement('button');
    button.textContent = '👀';
    button.style.position = 'absolute';
    button.style.zIndex = '8848';
    button.style.top = '5px';
    button.style.right = '5px';
    button.style.padding = '4px 12px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    button.style.border = 'none';
    button.style.borderRadius = '12px';
    button.style.cursor = 'pointer';

    return button;
};
