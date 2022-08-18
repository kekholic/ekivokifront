/* eslint-disable consistent-return */
import '../../App.css';
import React, { useEffect, useRef } from 'react';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import socket from '../../socket';
import './Canvas.module.css';
// import { useAppSelector } from '../../hooks/redux';

interface IProps {
  roomID: string | undefined;
  canSendMessage: Boolean;
}
interface Ifigure {
  START: string;
  x: number;
  y: number;
  STOP: string;
}
interface IMsg {
  roomID: string;
  figure: Ifigure;
}

export default function Canvas({ roomID, canSendMessage }: IProps) {
  // const user = useAppSelector((store) => store.user);
  const CANVAS_REF = useRef<HTMLCanvasElement>(null);

  const isDrawing = useRef(false);

  const drawHandler = (msg: IMsg) => {
    // // console.log('msg: ', msg.figure);
    const canvas = CANVAS_REF.current;
    if (canvas && isDrawing.current === false) {
      const context = canvas?.getContext('2d');
      // if (!ref.current) { return; }
      // const ctx = ref.current.getContext('2d');
      if (context) {
        if (msg.figure.START) {
          context.beginPath();
          context.lineTo(msg.figure.x, msg.figure.y);
        }
        if (msg.figure.x) {
          context.lineTo(msg.figure.x, msg.figure.y);
          // // console.log('yes');
          context.strokeStyle = 'black';
          context.lineWidth = 3;
          context.lineCap = 'round';
          context.lineJoin = 'round';

          context.stroke();
        }
        if (msg.figure.STOP) {
          context.closePath();
        }
      }
    }
  };

  function getCanvasOffset(event: any) {
    const currentTargetRect = event.currentTarget?.getBoundingClientRect();
    const eventOffsetX = event.pageX - currentTargetRect.left;
    const eventOffsetY = event.pageY - currentTargetRect.top;

    return { eventOffsetX, eventOffsetY };
  }

  function startDrawing(event: MouseEvent) {
    if (canSendMessage) {
      isDrawing.current = true;
      const canvas = CANVAS_REF.current;
      const context = canvas?.getContext('2d');
      if (context) {
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
  }

  function draw(event: MouseEvent) {
    if (canSendMessage) {
      if (isDrawing.current) {
        const canvas = CANVAS_REF.current;
        const context = canvas?.getContext('2d');
        if (context) {
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
          context.lineWidth = 3;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.stroke();
        }
      }
      event.preventDefault();
    }
  }

  function stopDrawing(event: MouseEvent) {
    if (canSendMessage) {
      if (isDrawing.current) {
        const canvas = CANVAS_REF.current;
        const context = canvas?.getContext('2d');
        // // console.log('STOP');

        socket.emit('draw_server', {
          roomID,
          figure: {
            STOP: 'STOP',
          },
        });
        context?.stroke();
        context?.closePath();
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
    if (canvas) {
      canvas.width = 550;
      canvas.height = 300;
    }

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
