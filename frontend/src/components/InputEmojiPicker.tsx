
import EmojiPicker, { Theme } from "emoji-picker-react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";

const InputEmojiPicker = <T extends FieldValues>(
  props: UseControllerProps<T> & {
  isOpen: boolean,
  toggleVisibilityEmojiPicker: () => void
})=> {
  const { isOpen, toggleVisibilityEmojiPicker, ...controllerProps } = props;
  // console.log(controllerProps);
  const { field } = useController(controllerProps)

  return (
    <EmojiPicker
      // {...field}
      // open={true}
      className="fixed right-0 top-2 z-20"
      onEmojiClick={(emojiSelected) => {
        field.onChange(emojiSelected.emoji);
        toggleVisibilityEmojiPicker();
      }}
      theme={Theme.DARK}
      open={isOpen}
      // reactionsDefaultOpen={true}
      // reactions={}
    />
  );
}

export default InputEmojiPicker

// import EmojiPicker, { Theme } from "emoji-picker-react";
// import { Controller, type Control } from "react-hook-form";

// interface InputEmojiPickerProps {
//   control: Control;
//   isOpen: boolean;
//   toggleVisibilityEmojiPicker: () => void;
// }

// const InputEmojiPicker: React.FC<InputEmojiPickerProps> = ({
//   control,
//   isOpen,
//   toggleVisibilityEmojiPicker,
// }) => {
//   return (

//       <Controller
//         name="emoji"
//         control={control}
//         render={({ field }) => (
//           <EmojiPicker
//             {...field}
//             // open={true}
//             className="fixed right-0 top-2 z-20"
//             onEmojiClick={(emojiSelected) => {
//               field.onChange(emojiSelected.emoji);
//               toggleVisibilityEmojiPicker();
//             }}
//             theme={Theme.DARK}
//             open={isOpen}
//             // reactionsDefaultOpen={true}
//             // reactions={}
//           />
//         )}
//       />
     
//   );
// };

// export default InputEmojiPicker;
