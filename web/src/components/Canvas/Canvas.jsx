/* eslint-disable consistent-return */
import '../../App.css';
import React, { useEffect, useRef } from 'react';
import CanvasContainer from '../CanvasContainer/CanvasContainer.jsx';
import socket from '../../socket';
import { useAppSelector } from '../../hooks/redux';

export default function Canvas({ roomID, canSendMessage }) {
  const user = useAppSelector((store) => store.user);
  const CANVAS_REF = useRef(null);

  const isDrawing = useRef(false);

  const drawHandler = (msg) => {
    // // console.log('msg: ', msg.figure);
    const canvas = CANVAS_REF.current;
    if (canvas && isDrawing.current === false) {
      const context = canvas.getContext('2d');
      if (msg.figure.START) {
        context.beginPath();
        context.lineTo(msg.figure.x, msg.figure.y);
      }
      if (msg.figure.x) {
        context.lineTo(msg.figure.x, msg.figure.y);
        // // console.log('yes');
        context.strokeStyle = 'black';
        context.lineWidth = '3px';
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.stroke();
      }
      if (msg.figure.STOP) {
        context.closePath();
      }
    }
  };

  function getCanvasOffset(event) {
    const currentTargetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.pageX - currentTargetRect.left;
    const eventOffsetY = event.pageY - currentTargetRect.top;

    return { eventOffsetX, eventOffsetY };
  }

  function startDrawing(event) {
    if (canSendMessage) {
      isDrawing.current = true;
      const canvas = CANVAS_REF.current;
      const context = canvas.getContext('2d');
      // // console.log('STARt');
      context.beginPath();
      const { eventOffsetX, eventOffsetY } = getCanvasOffset(event);
      socket.emit('draw_server', {
        roomID,
        figure: {
          START: 'START',
          x: eventOffsetX,
          y: eventOffsetY,
        },
      });
      context.lineTo(eventOffsetX, eventOffsetY);
      event.preventDefault();
    }
  }

  function draw(event) {
    if (canSendMessage) {
      if (isDrawing.current) {
        const canvas = CANVAS_REF.current;
        const context = canvas.getContext('2d');
        const { eventOffsetX, eventOffsetY } = getCanvasOffset(event);
        // // console.log(eventOffsetX, eventOffsetY);
        // // console.log(event);
        socket.emit('draw_server', {
          roomID,
          figure: {
            x: eventOffsetX,
            y: eventOffsetY,
          },
        });
        context.lineTo(eventOffsetX, eventOffsetY);

        context.strokeStyle = 'black';
        context.lineWidth = '3px';
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
      }
      event.preventDefault();
    }
  }

  function stopDrawing(event) {
    if (canSendMessage) {
      if (isDrawing.current) {
        const canvas = CANVAS_REF.current;
        const context = canvas.getContext('2d');
        // // console.log('STOP');

        socket.emit('draw_server', {
          roomID,
          figure: {
            STOP: 'STOP',
          },
        });
        context.stroke();
        context.closePath();
        isDrawing.current = false;
      }
      event.preventDefault();
    }
  }

  useEffect(() => {
    socket.on('draw', (msg) => {
      // // console.log('msg: ', msg.figure);
      drawHandler(msg);
    });

    const canvas = CANVAS_REF.current;
    // // console.log('canvas: ', canvas);
    canvas.width = 800;
    canvas.height = 600;

    if (canvas) {
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseout', stopDrawing);
      };
    }
  }, [canSendMessage]);

  return (
    <div>
      <CanvasContainer CANVAS_REF={CANVAS_REF} />
    </div>
  );
}
