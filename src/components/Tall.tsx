/**
 * The display face draws digits a little shorter than its capitals, so
 * "B1AK3" looked uneven. Runs of digits get the `.fig` class, which
 * stretches them to cap height (see globals.css). Screen readers get the
 * plain text once. Text without digits is returned as is.
 */
export default function Tall({ children }: { children: string | null | undefined }) {
  const text = children ?? "";
  if (!/\d/.test(text)) return <>{text}</>;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((word, w) =>
          /\d/.test(word) ? (
            <span key={w} className="whitespace-nowrap">
              {word.split(/(\d+)/).map((part, i) =>
                /^\d+$/.test(part) ? (
                  <span key={i} className="fig">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </span>
          ) : (
            word
          )
        )}
      </span>
    </>
  );
}
