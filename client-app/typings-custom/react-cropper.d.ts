// declare module 'react-cropper' {
//     import * as cropperjs from 'cropperjs';
//     import * as React from 'react';

//     type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

//     interface ReactCropperProps extends Cropper.Options, Omit<React.HTMLProps<HTMLImageElement>, 'data' | 'ref'> {
//         ref?: string | React.LegacyRef<ReactCropper> | React.RefObject<Cropper> | ((cropper: null | Cropper) => any);
//     }

//     interface ReactCropper extends Cropper { } // tslint:disable-line no-empty-interface
//     class ReactCropper extends React.Component<ReactCropperProps> {
//         on(eventname: string, callback: () => void): void;
//     }
//     export default ReactCropper;
// }
