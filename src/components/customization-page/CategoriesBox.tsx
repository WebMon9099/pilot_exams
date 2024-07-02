import { useMemo, useState } from "react";
import { c, p } from "../../lib";
import { Category } from "../../types";
import { Button } from "../core";

interface CategoriesBoxProps extends React.HTMLAttributes<HTMLUListElement> {
  categories: Category[];
  disabledCateogiresIds: string[];
  setDisabledCateogriesIds: (ids: string[]) => void;
}

const CategoriesBox: React.FC<CategoriesBoxProps> = ({
  categories,
  disabledCateogiresIds,
  setDisabledCateogriesIds,
  ...rest
}) => {
  const [openCategoryIndex, setOpenCategoryIndex] = useState<
    number | undefined
  >();

  const sortedCategories = useMemo(() => {
    return categories.sort((c1, c2) => {
      return c1.name.localeCompare(c2.name);
    });
  }, [categories]);

  return (
    <>
      <ul
        {...rest}
        className={c(
          "flex flex-col gap-2 rounded-md border border-[#e5e5e5] bg-[#f7f7f7] p-4",
          rest.className
        )}
      >
        {sortedCategories.map((category, i) => (
          <CategoryRow
            index={i}
            category={category}
            disabledCateogiresIds={disabledCateogiresIds}
            setDisabledCateogriesIds={setDisabledCateogriesIds}
            type="category"
            openCategoryIndex={openCategoryIndex}
            setOpenCategoryIndex={setOpenCategoryIndex}
            key={category.id}
          />
        ))}
      </ul>
      <div className="mt-[1vh] flex items-center">
        <Button
          color="gray"
          className="!px-2 text-xs"
          onClick={() => setDisabledCateogriesIds([])}
        >
          Select All
        </Button>
        <Button
          color="gray"
          className="!px-2 text-xs"
          onClick={() => {
            const allCategoriesIds = categories.reduce(
              (arr, category) => [...arr, ...flatCategoryIds(category)],
              [] as string[]
            );

            setDisabledCateogriesIds(allCategoriesIds);

            function flatCategoryIds(category: Category): string[] {
              return [
                category.id,
                ...category.sub_categories.reduce(
                  (ids, category) => [...ids, ...flatCategoryIds(category)],
                  [] as string[]
                ),
              ];
            }
          }}
        >
          Deselect All
        </Button>
      </div>
    </>
  );
};

export default CategoriesBox;

interface CategoryRowProps extends React.LiHTMLAttributes<HTMLLIElement> {
  index: number;
  disabledCateogiresIds: string[];
  setDisabledCateogriesIds: (ids: string[]) => void;
  category: Category;
  type: "category" | "sub-category";
  openCategoryIndex?: number | undefined;
  setOpenCategoryIndex?: (index: number | undefined) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  index: i,
  disabledCateogiresIds,
  setDisabledCateogriesIds,
  category,
  type,
  openCategoryIndex,
  setOpenCategoryIndex,
  ...rest
}) => {
  const sortedSubCategories = useMemo(() => {
    return category.sub_categories.sort((c1, c2) => {
      return c1.name.localeCompare(c2.name);
    });
  }, [category.sub_categories]);

  return (
    <li {...rest}>
      <button
        className="flex w-full items-center gap-2"
        onClick={() => {
          if (sortedSubCategories.length > 0 && setOpenCategoryIndex) {
            if (i === openCategoryIndex) setOpenCategoryIndex(undefined);
            else setOpenCategoryIndex(i);
          }
        }}
      >
        {sortedSubCategories.length > 0 ? (
          <img
            alt="arrow icon"
            src={p("images/light_grey_arrow.svg")}
            className={c(
              "w-[10px] transition",
              i === openCategoryIndex ? "rotate-0" : "-rotate-90"
            )}
          />
        ) : (
          <div className="w-[10px]" />
        )}
        {(() => {
          var checked: boolean | "half" = !disabledCateogiresIds.includes(
            category.id
          );

          if (checked) {
            if (
              disabledCateogiresIds.some((id) =>
                sortedSubCategories.map((category) => category.id).includes(id)
              )
            ) {
              checked = "half";
            }
          }

          return (
            <Checkbox
              checked={checked}
              onToggle={() => {
                const newDisabledCateogiresIds = [...disabledCateogiresIds];

                const removeFromDeleted = newDisabledCateogiresIds.includes(
                  category.id
                );

                if (removeFromDeleted) {
                  const index = newDisabledCateogiresIds.indexOf(category.id);

                  if (index !== -1) newDisabledCateogiresIds.splice(index, 1);

                  sortedSubCategories.forEach((category) => {
                    const index = newDisabledCateogiresIds.indexOf(category.id);

                    if (index !== -1) newDisabledCateogiresIds.splice(index, 1);
                  });
                } else {
                  newDisabledCateogiresIds.push(
                    category.id,
                    ...sortedSubCategories
                      .filter(
                        (cateogry) =>
                          !newDisabledCateogiresIds.includes(cateogry.id)
                      )
                      .map((category) => category.id)
                  );
                }

                setDisabledCateogriesIds(newDisabledCateogiresIds);
              }}
              className={c(
                type === "category" ? "h-4 w-4" : "h-[14px] w-[14px]"
              )}
              full={checked && category.parent_category_id !== undefined}
            />
          );
        })()}
        <span
          className={c(
            "flex items-center gap-2 text-sm",
            type === "category" && "font-semibold text-[#6b6b6b]",
            type === "sub-category" && "text-[#828282]",
            sortedSubCategories.length === 0 && "cursor-default"
          )}
        >
          {category.name}
        </span>
      </button>
      {type === "category" && sortedSubCategories.length > 0 && (
        <ul
          className={c(
            "ml-4 flex flex-col gap-1 overflow-hidden transition-all",
            i === openCategoryIndex && "mt-2"
          )}
          style={{
            maxHeight:
              i === openCategoryIndex ? sortedSubCategories.length * 24 : 0,
          }}
        >
          {sortedSubCategories.map((category) => (
            <CategoryRow
              index={i}
              disabledCateogiresIds={disabledCateogiresIds}
              setDisabledCateogriesIds={setDisabledCateogriesIds}
              category={category}
              type="sub-category"
              key={category.id}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Checkbox: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked: boolean | "half";
    onToggle: () => void;
    full?: boolean;
  }
> = ({ checked = true, onToggle, full = false, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        "relative flex items-center justify-center rounded-[3px] border border-[#e2e2e2] bg-[#efefef]",
        checked ? (full ? "" : "border-0 !bg-theme-dark-blue") : "",
        rest.className
      )}
      onClick={onToggle}
    >
      {checked === true && (
        <img
          alt="check icon"
          src={p(`images/icon_check${full ? "_blue" : ""}.svg`)}
          className="h-3 w-3"
        />
      )}
      {checked === "half" && (
        <img
          alt="sub icon"
          src={p("images/icon_sub.svg")}
          className="h-3 w-3"
        />
      )}
    </button>
  );
};
