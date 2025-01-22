import React from 'react';

const Lines = ({
  height,
  position,
  overflowX,
  overflowY,
  marginLeft,
  whiteSpace,
  gap,
  overflow,
  maxHeight,
  maxWidth,
  display,
  flexDirection,
  backgroundColor,
  justifyContent,
  conteudo,
  width,
  alignItems,
  marginTop,
  padding,
  borderRadius,
  color,
  border,
  flexWrap,
  zIndex, // Adicione zIndex como uma prop
  onClick
}) => {
  const estilos = {
    gap: gap || '5px',
    display: display || 'flex',
    flexDirection: flexDirection,
    alignItems: alignItems || 'center',
    justifyContent: justifyContent || 'flex-start',
    width: width || '100%',
    marginTop: marginTop,
    position: position, // Certifique-se de que position esteja definido
    maxHeight: maxHeight,
    overflow: overflow,
    overflowX: overflowX,
    overflowY: overflowY,
    height: height,
    padding: padding,
    maxWidth: maxWidth,
    backgroundColor: backgroundColor,
    borderRadius: borderRadius,
    color: color,
    border: border,
    marginLeft: marginLeft,
    flexWrap: flexWrap || 'wrap',
    whiteSpace: whiteSpace,
    zIndex: zIndex // Adicione zIndex ao estilo
  };

  return (
    <div style={estilos} onClick={onClick}>
      {conteudo}
    </div>
  );
};

export default Lines;