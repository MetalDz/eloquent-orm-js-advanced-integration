import { BaseModel, Factory, PivotHelperMixin } from "@alpha.consultings/eloquent-orm.js";

class PivotModelBase extends BaseModel {}
const PivotModel = PivotHelperMixin(PivotModelBase);

/**
 * Auto-generated pivot factory for many-to-many operations.
 * Table: post_user_pivot
 */
export class UserPostPivotFactory extends Factory<BaseModel> {
  readonly model = PivotModel;

  definition(): Partial<Record<string, unknown>> {
    return {
      user_id: null,
      post_id: null,
    };
  }

  async createPivot(
    foreignId: string | number,
    relatedIds: Iterable<string | number>,
    extraPivotAttrs?: Record<string, unknown>
  ): Promise<void> {
    type PivotInstanceLike = {
      attach?: (
        pivotTable: string,
        foreignKey: string,
        relatedKey: string,
        foreignId: string | number,
        relatedIds: Array<string | number>,
        extra?: Record<string, unknown>
      ) => Promise<void>;
      attachMany?: (entries: Array<Record<string, unknown>>) => Promise<void>;
      withTransaction?: <R>(fn: () => Promise<R>) => Promise<R>;
    };

    const PivotCtor = this.model as unknown as new () => PivotInstanceLike;
    const pivotInstance = new PivotCtor();
    const relatedArray = Array.from(relatedIds);

    try {
      if (typeof pivotInstance.attachMany === "function") {
        const entries = relatedArray.map((rid) => ({
          ["user_id"]: foreignId,
          ["post_id"]: rid,
          ...(extraPivotAttrs ?? {}),
        }));
        await pivotInstance.attachMany(entries);
      } else if (typeof pivotInstance.attach === "function") {
        const attach = pivotInstance.attach.bind(pivotInstance);
        if (typeof pivotInstance.withTransaction === "function") {
          await pivotInstance.withTransaction(async () => {
            await attach(
              "post_user_pivot",
              "user_id",
              "post_id",
              foreignId,
              relatedArray,
              extraPivotAttrs
            );
          });
        } else {
          await attach(
            "post_user_pivot",
            "user_id",
            "post_id",
            foreignId,
            relatedArray,
            extraPivotAttrs
          );
        }
      } else {
        throw new Error("PivotHelperMixin does not expose attach/attachMany API.");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `[pivot-factory] Failed to attach pivot rows for ${foreignId} -> ${relatedArray}:`,
        err
      );
      throw err;
    }
  }
}