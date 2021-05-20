// const category = db.define(
// 	"categories",
// 	{
// 		category_id: {
// 			type: DataTypes.BIGINT,
// 			autoIncrement: true,
// 			allowNull: false,
// 			primaryKey: true,
// 		},
// 		board_id: {
// 			type: DataTypes.BIGINT,
// 			allowNull: false,
// 			references: {
// 				model: "boards",
// 				key: "board_id",
// 			},
// 		},
// 		name: {
// 			type: DataTypes.STRING,
// 			default: false,
// 			allowNull: false,
// 		},
// 	},
// 	{
// 		createdAt: "created_at",
// 		updatedAt: "updated_at",
// 		tableName: "categories",
// 		underscored: true,
// 	}
// );
