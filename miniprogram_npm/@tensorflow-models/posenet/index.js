module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1606226927262, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var mobilenet_1 = require("./mobilenet");
exports.MobileNet = mobilenet_1.MobileNet;
var decode_multiple_poses_1 = require("./multi_pose/decode_multiple_poses");
exports.decodeMultiplePoses = decode_multiple_poses_1.decodeMultiplePoses;
var decode_single_pose_1 = require("./single_pose/decode_single_pose");
exports.decodeSinglePose = decode_single_pose_1.decodeSinglePose;
var keypoints_1 = require("./keypoints");
exports.partChannels = keypoints_1.partChannels;
exports.partIds = keypoints_1.partIds;
exports.partNames = keypoints_1.partNames;
exports.poseChain = keypoints_1.poseChain;
var posenet_model_1 = require("./posenet_model");
exports.load = posenet_model_1.load;
exports.PoseNet = posenet_model_1.PoseNet;
var util_1 = require("./util");
exports.getAdjacentKeyPoints = util_1.getAdjacentKeyPoints;
exports.getBoundingBox = util_1.getBoundingBox;
exports.getBoundingBoxPoints = util_1.getBoundingBoxPoints;
exports.scaleAndFlipPoses = util_1.scaleAndFlipPoses;
exports.scalePose = util_1.scalePose;
var version_1 = require("./version");
exports.version = version_1.version;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./mobilenet":1606226927263,"./multi_pose/decode_multiple_poses":1606226927265,"./single_pose/decode_single_pose":1606226927271,"./keypoints":1606226927269,"./posenet_model":1606226927274,"./util":1606226927277,"./version":1606226927278}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927263, function(require, module, exports) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var base_model_1 = require("./base_model");
var MobileNet = (function (_super) {
    __extends(MobileNet, _super);
    function MobileNet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MobileNet.prototype.preprocessInput = function (input) {
        return tf.tidy(function () { return tf.div(input, 127.5).sub(1.0); });
    };
    MobileNet.prototype.nameOutputResults = function (results) {
        var offsets = results[0], heatmap = results[1], displacementFwd = results[2], displacementBwd = results[3];
        return { offsets: offsets, heatmap: heatmap, displacementFwd: displacementFwd, displacementBwd: displacementBwd };
    };
    return MobileNet;
}(base_model_1.BaseModel));
exports.MobileNet = MobileNet;
//# sourceMappingURL=mobilenet.js.map
}, function(modId) { var map = {"./base_model":1606226927264}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927264, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var BaseModel = (function () {
    function BaseModel(model, outputStride) {
        this.model = model;
        this.outputStride = outputStride;
        var inputShape = this.model.inputs[0].shape;
        tf.util.assert((inputShape[1] === -1) && (inputShape[2] === -1), function () { return "Input shape [" + inputShape[1] + ", " + inputShape[2] + "] " +
            "must both be equal to or -1"; });
    }
    BaseModel.prototype.predict = function (input) {
        var _this = this;
        return tf.tidy(function () {
            var asFloat = _this.preprocessInput(input.toFloat());
            var asBatch = asFloat.expandDims(0);
            var results = _this.model.predict(asBatch);
            var results3d = results.map(function (y) { return y.squeeze([0]); });
            var namedResults = _this.nameOutputResults(results3d);
            return {
                heatmapScores: namedResults.heatmap.sigmoid(),
                offsets: namedResults.offsets,
                displacementFwd: namedResults.displacementFwd,
                displacementBwd: namedResults.displacementBwd
            };
        });
    };
    BaseModel.prototype.dispose = function () {
        this.model.dispose();
    };
    return BaseModel;
}());
exports.BaseModel = BaseModel;
//# sourceMappingURL=base_model.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927265, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var build_part_with_score_queue_1 = require("./build_part_with_score_queue");
var decode_pose_1 = require("./decode_pose");
var util_1 = require("./util");
function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, _a, keypointId) {
    var x = _a.x, y = _a.y;
    return poses.some(function (_a) {
        var keypoints = _a.keypoints;
        var correspondingKeypoint = keypoints[keypointId].position;
        return util_1.squaredDistance(y, x, correspondingKeypoint.y, correspondingKeypoint.x) <=
            squaredNmsRadius;
    });
}
function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
    var notOverlappedKeypointScores = instanceKeypoints.reduce(function (result, _a, keypointId) {
        var position = _a.position, score = _a.score;
        if (!withinNmsRadiusOfCorrespondingPoint(existingPoses, squaredNmsRadius, position, keypointId)) {
            result += score;
        }
        return result;
    }, 0.0);
    return notOverlappedKeypointScores /= instanceKeypoints.length;
}
var kLocalMaximumRadius = 1;
function decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, maxPoseDetections, scoreThreshold, nmsRadius) {
    if (scoreThreshold === void 0) { scoreThreshold = 0.5; }
    if (nmsRadius === void 0) { nmsRadius = 20; }
    var poses = [];
    var queue = build_part_with_score_queue_1.buildPartWithScoreQueue(scoreThreshold, kLocalMaximumRadius, scoresBuffer);
    var squaredNmsRadius = nmsRadius * nmsRadius;
    while (poses.length < maxPoseDetections && !queue.empty()) {
        var root = queue.dequeue();
        var rootImageCoords = util_1.getImageCoords(root.part, outputStride, offsetsBuffer);
        if (withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, rootImageCoords, root.part.id)) {
            continue;
        }
        var keypoints = decode_pose_1.decodePose(root, scoresBuffer, offsetsBuffer, outputStride, displacementsFwdBuffer, displacementsBwdBuffer);
        var score = getInstanceScore(poses, squaredNmsRadius, keypoints);
        poses.push({ keypoints: keypoints, score: score });
    }
    return poses;
}
exports.decodeMultiplePoses = decodeMultiplePoses;
//# sourceMappingURL=decode_multiple_poses.js.map
}, function(modId) { var map = {"./build_part_with_score_queue":1606226927266,"./decode_pose":1606226927268,"./util":1606226927270}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927266, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var max_heap_1 = require("./max_heap");
function scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores) {
    var _a = scores.shape, height = _a[0], width = _a[1];
    var localMaximum = true;
    var yStart = Math.max(heatmapY - localMaximumRadius, 0);
    var yEnd = Math.min(heatmapY + localMaximumRadius + 1, height);
    for (var yCurrent = yStart; yCurrent < yEnd; ++yCurrent) {
        var xStart = Math.max(heatmapX - localMaximumRadius, 0);
        var xEnd = Math.min(heatmapX + localMaximumRadius + 1, width);
        for (var xCurrent = xStart; xCurrent < xEnd; ++xCurrent) {
            if (scores.get(yCurrent, xCurrent, keypointId) > score) {
                localMaximum = false;
                break;
            }
        }
        if (!localMaximum) {
            break;
        }
    }
    return localMaximum;
}
function buildPartWithScoreQueue(scoreThreshold, localMaximumRadius, scores) {
    var _a = scores.shape, height = _a[0], width = _a[1], numKeypoints = _a[2];
    var queue = new max_heap_1.MaxHeap(height * width * numKeypoints, function (_a) {
        var score = _a.score;
        return score;
    });
    for (var heatmapY = 0; heatmapY < height; ++heatmapY) {
        for (var heatmapX = 0; heatmapX < width; ++heatmapX) {
            for (var keypointId = 0; keypointId < numKeypoints; ++keypointId) {
                var score = scores.get(heatmapY, heatmapX, keypointId);
                if (score < scoreThreshold) {
                    continue;
                }
                if (scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores)) {
                    queue.enqueue({ score: score, part: { heatmapY: heatmapY, heatmapX: heatmapX, id: keypointId } });
                }
            }
        }
    }
    return queue;
}
exports.buildPartWithScoreQueue = buildPartWithScoreQueue;
//# sourceMappingURL=build_part_with_score_queue.js.map
}, function(modId) { var map = {"./max_heap":1606226927267}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927267, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
function half(k) {
    return Math.floor(k / 2);
}
var MaxHeap = (function () {
    function MaxHeap(maxSize, getElementValue) {
        this.priorityQueue = new Array(maxSize);
        this.numberOfElements = -1;
        this.getElementValue = getElementValue;
    }
    MaxHeap.prototype.enqueue = function (x) {
        this.priorityQueue[++this.numberOfElements] = x;
        this.swim(this.numberOfElements);
    };
    MaxHeap.prototype.dequeue = function () {
        var max = this.priorityQueue[0];
        this.exchange(0, this.numberOfElements--);
        this.sink(0);
        this.priorityQueue[this.numberOfElements + 1] = null;
        return max;
    };
    MaxHeap.prototype.empty = function () {
        return this.numberOfElements === -1;
    };
    MaxHeap.prototype.size = function () {
        return this.numberOfElements + 1;
    };
    MaxHeap.prototype.all = function () {
        return this.priorityQueue.slice(0, this.numberOfElements + 1);
    };
    MaxHeap.prototype.max = function () {
        return this.priorityQueue[0];
    };
    MaxHeap.prototype.swim = function (k) {
        while (k > 0 && this.less(half(k), k)) {
            this.exchange(k, half(k));
            k = half(k);
        }
    };
    MaxHeap.prototype.sink = function (k) {
        while (2 * k <= this.numberOfElements) {
            var j = 2 * k;
            if (j < this.numberOfElements && this.less(j, j + 1)) {
                j++;
            }
            if (!this.less(k, j)) {
                break;
            }
            this.exchange(k, j);
            k = j;
        }
    };
    MaxHeap.prototype.getValueAt = function (i) {
        return this.getElementValue(this.priorityQueue[i]);
    };
    MaxHeap.prototype.less = function (i, j) {
        return this.getValueAt(i) < this.getValueAt(j);
    };
    MaxHeap.prototype.exchange = function (i, j) {
        var t = this.priorityQueue[i];
        this.priorityQueue[i] = this.priorityQueue[j];
        this.priorityQueue[j] = t;
    };
    return MaxHeap;
}());
exports.MaxHeap = MaxHeap;
//# sourceMappingURL=max_heap.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927268, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var keypoints_1 = require("../keypoints");
var util_1 = require("./util");
var util_2 = require("./util");
var parentChildrenTuples = keypoints_1.poseChain.map(function (_a) {
    var parentJoinName = _a[0], childJoinName = _a[1];
    return ([keypoints_1.partIds[parentJoinName], keypoints_1.partIds[childJoinName]]);
});
var parentToChildEdges = parentChildrenTuples.map(function (_a) {
    var childJointId = _a[1];
    return childJointId;
});
var childToParentEdges = parentChildrenTuples.map(function (_a) {
    var parentJointId = _a[0];
    return parentJointId;
});
function getDisplacement(edgeId, point, displacements) {
    var numEdges = displacements.shape[2] / 2;
    return {
        y: displacements.get(point.y, point.x, edgeId),
        x: displacements.get(point.y, point.x, numEdges + edgeId)
    };
}
function getStridedIndexNearPoint(point, outputStride, height, width) {
    return {
        y: util_1.clamp(Math.round(point.y / outputStride), 0, height - 1),
        x: util_1.clamp(Math.round(point.x / outputStride), 0, width - 1)
    };
}
function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep) {
    if (offsetRefineStep === void 0) { offsetRefineStep = 2; }
    var _a = scoresBuffer.shape, height = _a[0], width = _a[1];
    var sourceKeypointIndices = getStridedIndexNearPoint(sourceKeypoint.position, outputStride, height, width);
    var displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
    var displacedPoint = util_2.addVectors(sourceKeypoint.position, displacement);
    var targetKeypoint = displacedPoint;
    for (var i = 0; i < offsetRefineStep; i++) {
        var targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
        var offsetPoint = util_1.getOffsetPoint(targetKeypointIndices.y, targetKeypointIndices.x, targetKeypointId, offsets);
        targetKeypoint = util_2.addVectors({
            x: targetKeypointIndices.x * outputStride,
            y: targetKeypointIndices.y * outputStride
        }, { x: offsetPoint.x, y: offsetPoint.y });
    }
    var targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
    var score = scoresBuffer.get(targetKeyPointIndices.y, targetKeyPointIndices.x, targetKeypointId);
    return { position: targetKeypoint, part: keypoints_1.partNames[targetKeypointId], score: score };
}
function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
    var numParts = scores.shape[2];
    var numEdges = parentToChildEdges.length;
    var instanceKeypoints = new Array(numParts);
    var rootPart = root.part, rootScore = root.score;
    var rootPoint = util_2.getImageCoords(rootPart, outputStride, offsets);
    instanceKeypoints[rootPart.id] = {
        score: rootScore,
        part: keypoints_1.partNames[rootPart.id],
        position: rootPoint
    };
    for (var edge = numEdges - 1; edge >= 0; --edge) {
        var sourceKeypointId = parentToChildEdges[edge];
        var targetKeypointId = childToParentEdges[edge];
        if (instanceKeypoints[sourceKeypointId] &&
            !instanceKeypoints[targetKeypointId]) {
            instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsBwd);
        }
    }
    for (var edge = 0; edge < numEdges; ++edge) {
        var sourceKeypointId = childToParentEdges[edge];
        var targetKeypointId = parentToChildEdges[edge];
        if (instanceKeypoints[sourceKeypointId] &&
            !instanceKeypoints[targetKeypointId]) {
            instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsFwd);
        }
    }
    return instanceKeypoints;
}
exports.decodePose = decodePose;
//# sourceMappingURL=decode_pose.js.map
}, function(modId) { var map = {"../keypoints":1606226927269,"./util":1606226927270}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927269, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.partNames = [
    'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'leftShoulder',
    'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist',
    'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
];
exports.NUM_KEYPOINTS = exports.partNames.length;
exports.partIds = exports.partNames.reduce(function (result, jointName, i) {
    result[jointName] = i;
    return result;
}, {});
var connectedPartNames = [
    ['leftHip', 'leftShoulder'], ['leftElbow', 'leftShoulder'],
    ['leftElbow', 'leftWrist'], ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'], ['rightHip', 'rightShoulder'],
    ['rightElbow', 'rightShoulder'], ['rightElbow', 'rightWrist'],
    ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
    ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip']
];
exports.poseChain = [
    ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
    ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
    ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
    ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
    ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
    ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
    ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
    ['rightKnee', 'rightAnkle']
];
exports.connectedPartIndices = connectedPartNames.map(function (_a) {
    var jointNameA = _a[0], jointNameB = _a[1];
    return ([exports.partIds[jointNameA], exports.partIds[jointNameB]]);
});
exports.partChannels = [
    'left_face',
    'right_face',
    'right_upper_leg_front',
    'right_lower_leg_back',
    'right_upper_leg_back',
    'left_lower_leg_front',
    'left_upper_leg_front',
    'left_upper_leg_back',
    'left_lower_leg_back',
    'right_feet',
    'right_lower_leg_front',
    'left_feet',
    'torso_front',
    'torso_back',
    'right_upper_arm_front',
    'right_upper_arm_back',
    'right_lower_arm_back',
    'left_lower_arm_front',
    'left_upper_arm_front',
    'left_upper_arm_back',
    'left_lower_arm_back',
    'right_hand',
    'right_lower_arm_front',
    'left_hand'
];
//# sourceMappingURL=keypoints.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927270, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var keypoints_1 = require("../keypoints");
function getOffsetPoint(y, x, keypoint, offsets) {
    return {
        y: offsets.get(y, x, keypoint),
        x: offsets.get(y, x, keypoint + keypoints_1.NUM_KEYPOINTS)
    };
}
exports.getOffsetPoint = getOffsetPoint;
function getImageCoords(part, outputStride, offsets) {
    var heatmapY = part.heatmapY, heatmapX = part.heatmapX, keypoint = part.id;
    var _a = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets), y = _a.y, x = _a.x;
    return {
        x: part.heatmapX * outputStride + x,
        y: part.heatmapY * outputStride + y
    };
}
exports.getImageCoords = getImageCoords;
function fillArray(element, size) {
    var result = new Array(size);
    for (var i = 0; i < size; i++) {
        result[i] = element;
    }
    return result;
}
exports.fillArray = fillArray;
function clamp(a, min, max) {
    if (a < min) {
        return min;
    }
    if (a > max) {
        return max;
    }
    return a;
}
exports.clamp = clamp;
function squaredDistance(y1, x1, y2, x2) {
    var dy = y2 - y1;
    var dx = x2 - x1;
    return dy * dy + dx * dx;
}
exports.squaredDistance = squaredDistance;
function addVectors(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}
exports.addVectors = addVectors;
function clampVector(a, min, max) {
    return { y: clamp(a.y, min, max), x: clamp(a.x, min, max) };
}
exports.clampVector = clampVector;
//# sourceMappingURL=util.js.map
}, function(modId) { var map = {"../keypoints":1606226927269}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927271, function(require, module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var keypoints_1 = require("../keypoints");
var argmax2d_1 = require("./argmax2d");
var util_1 = require("./util");
function decodeSinglePose(heatmapScores, offsets, outputStride) {
    return __awaiter(this, void 0, void 0, function () {
        var totalScore, heatmapValues, allTensorBuffers, scoresBuffer, offsetsBuffer, heatmapValuesBuffer, offsetPoints, offsetPointsBuffer, keypointConfidence, keypoints;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    totalScore = 0.0;
                    heatmapValues = argmax2d_1.argmax2d(heatmapScores);
                    return [4, Promise.all([heatmapScores.buffer(), offsets.buffer(), heatmapValues.buffer()])];
                case 1:
                    allTensorBuffers = _a.sent();
                    scoresBuffer = allTensorBuffers[0];
                    offsetsBuffer = allTensorBuffers[1];
                    heatmapValuesBuffer = allTensorBuffers[2];
                    offsetPoints = util_1.getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
                    return [4, offsetPoints.buffer()];
                case 2:
                    offsetPointsBuffer = _a.sent();
                    keypointConfidence = Array.from(util_1.getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
                    keypoints = keypointConfidence.map(function (score, keypointId) {
                        totalScore += score;
                        return {
                            position: {
                                y: offsetPointsBuffer.get(keypointId, 0),
                                x: offsetPointsBuffer.get(keypointId, 1)
                            },
                            part: keypoints_1.partNames[keypointId],
                            score: score
                        };
                    });
                    heatmapValues.dispose();
                    offsetPoints.dispose();
                    return [2, { keypoints: keypoints, score: totalScore / keypoints.length }];
            }
        });
    });
}
exports.decodeSinglePose = decodeSinglePose;
//# sourceMappingURL=decode_single_pose.js.map
}, function(modId) { var map = {"../keypoints":1606226927269,"./argmax2d":1606226927272,"./util":1606226927273}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927272, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
function mod(a, b) {
    return tf.tidy(function () {
        var floored = a.div(tf.scalar(b, 'int32'));
        return a.sub(floored.mul(tf.scalar(b, 'int32')));
    });
}
function argmax2d(inputs) {
    var _a = inputs.shape, height = _a[0], width = _a[1], depth = _a[2];
    return tf.tidy(function () {
        var reshaped = inputs.reshape([height * width, depth]);
        var coords = reshaped.argMax(0);
        var yCoords = coords.div(tf.scalar(width, 'int32')).expandDims(1);
        var xCoords = mod(coords, width).expandDims(1);
        return tf.concat([yCoords, xCoords], 1);
    });
}
exports.argmax2d = argmax2d;
//# sourceMappingURL=argmax2d.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927273, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var keypoints_1 = require("../keypoints");
function getPointsConfidence(heatmapScores, heatMapCoords) {
    var numKeypoints = heatMapCoords.shape[0];
    var result = new Float32Array(numKeypoints);
    for (var keypoint = 0; keypoint < numKeypoints; keypoint++) {
        var y = heatMapCoords.get(keypoint, 0);
        var x = heatMapCoords.get(keypoint, 1);
        result[keypoint] = heatmapScores.get(y, x, keypoint);
    }
    return result;
}
exports.getPointsConfidence = getPointsConfidence;
function getOffsetPoint(y, x, keypoint, offsetsBuffer) {
    return {
        y: offsetsBuffer.get(y, x, keypoint),
        x: offsetsBuffer.get(y, x, keypoint + keypoints_1.NUM_KEYPOINTS)
    };
}
function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
    var result = [];
    for (var keypoint = 0; keypoint < keypoints_1.NUM_KEYPOINTS; keypoint++) {
        var heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
        var heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
        var _a = getOffsetPoint(heatmapY, heatmapX, keypoint, offsetsBuffer), x = _a.x, y = _a.y;
        result.push(y);
        result.push(x);
    }
    return tf.tensor2d(result, [keypoints_1.NUM_KEYPOINTS, 2]);
}
exports.getOffsetVectors = getOffsetVectors;
function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
    return tf.tidy(function () {
        var offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
        return heatMapCoordsBuffer.toTensor()
            .mul(tf.scalar(outputStride, 'int32'))
            .toFloat()
            .add(offsetVectors);
    });
}
exports.getOffsetPoints = getOffsetPoints;
//# sourceMappingURL=util.js.map
}, function(modId) { var map = {"../keypoints":1606226927269}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927274, function(require, module, exports) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tfconv = require("@tensorflow/tfjs-converter");
var tf = require("@tensorflow/tfjs-core");
var checkpoints_1 = require("./checkpoints");
var mobilenet_1 = require("./mobilenet");
var decode_multiple_poses_1 = require("./multi_pose/decode_multiple_poses");
var resnet_1 = require("./resnet");
var decode_single_pose_1 = require("./single_pose/decode_single_pose");
var util_1 = require("./util");
var MOBILENET_V1_CONFIG = {
    architecture: 'MobileNetV1',
    outputStride: 16,
    multiplier: 0.75,
    inputResolution: 257,
};
var VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
var VALID_STRIDE = {
    'MobileNetV1': [8, 16, 32],
    'ResNet50': [32, 16]
};
var VALID_MULTIPLIER = {
    'MobileNetV1': [0.50, 0.75, 1.0],
    'ResNet50': [1.0]
};
var VALID_QUANT_BYTES = [1, 2, 4];
function validateModelConfig(config) {
    config = config || MOBILENET_V1_CONFIG;
    if (config.architecture == null) {
        config.architecture = 'MobileNetV1';
    }
    if (VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
        throw new Error("Invalid architecture " + config.architecture + ". " +
            ("Should be one of " + VALID_ARCHITECTURE));
    }
    if (config.inputResolution == null) {
        config.inputResolution = 257;
    }
    util_1.validateInputResolution(config.inputResolution);
    if (config.outputStride == null) {
        config.outputStride = 16;
    }
    if (VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
        throw new Error("Invalid outputStride " + config.outputStride + ". " +
            ("Should be one of " + VALID_STRIDE[config.architecture] + " ") +
            ("for architecutre " + config.architecture + "."));
    }
    if (config.multiplier == null) {
        config.multiplier = 1.0;
    }
    if (VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
        throw new Error("Invalid multiplier " + config.multiplier + ". " +
            ("Should be one of " + VALID_MULTIPLIER[config.architecture] + " ") +
            ("for architecutre " + config.architecture + "."));
    }
    if (config.quantBytes == null) {
        config.quantBytes = 4;
    }
    if (VALID_QUANT_BYTES.indexOf(config.quantBytes) < 0) {
        throw new Error("Invalid quantBytes " + config.quantBytes + ". " +
            ("Should be one of " + VALID_QUANT_BYTES + " ") +
            ("for architecutre " + config.architecture + "."));
    }
    return config;
}
exports.SINGLE_PERSON_INFERENCE_CONFIG = {
    flipHorizontal: false
};
exports.MULTI_PERSON_INFERENCE_CONFIG = {
    flipHorizontal: false,
    maxDetections: 5,
    scoreThreshold: 0.5,
    nmsRadius: 20
};
function validateSinglePersonInferenceConfig(config) { }
function validateMultiPersonInputConfig(config) {
    var maxDetections = config.maxDetections, scoreThreshold = config.scoreThreshold, nmsRadius = config.nmsRadius;
    if (maxDetections <= 0) {
        throw new Error("Invalid maxDetections " + maxDetections + ". " +
            "Should be > 0");
    }
    if (scoreThreshold < 0.0 || scoreThreshold > 1.0) {
        throw new Error("Invalid scoreThreshold " + scoreThreshold + ". " +
            "Should be in range [0.0, 1.0]");
    }
    if (nmsRadius <= 0) {
        throw new Error("Invalid nmsRadius " + nmsRadius + ".");
    }
}
var PoseNet = (function () {
    function PoseNet(net, inputResolution) {
        util_1.assertValidOutputStride(net.outputStride);
        util_1.assertValidResolution(inputResolution, net.outputStride);
        this.baseModel = net;
        this.inputResolution = inputResolution;
    }
    PoseNet.prototype.estimateMultiplePoses = function (input, config) {
        if (config === void 0) { config = exports.MULTI_PERSON_INFERENCE_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            var configWithDefaults, outputStride, inputResolution, _a, height, width, _b, resized, padding, _c, heatmapScores, offsets, displacementFwd, displacementBwd, allTensorBuffers, scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, poses, resultPoses;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        configWithDefaults = __assign({}, exports.MULTI_PERSON_INFERENCE_CONFIG, config);
                        validateMultiPersonInputConfig(config);
                        outputStride = this.baseModel.outputStride;
                        inputResolution = this.inputResolution;
                        _a = util_1.getInputTensorDimensions(input), height = _a[0], width = _a[1];
                        _b = util_1.padAndResizeTo(input, inputResolution), resized = _b.resized, padding = _b.padding;
                        _c = this.baseModel.predict(resized), heatmapScores = _c.heatmapScores, offsets = _c.offsets, displacementFwd = _c.displacementFwd, displacementBwd = _c.displacementBwd;
                        return [4, util_1.toTensorBuffers3D([heatmapScores, offsets, displacementFwd, displacementBwd])];
                    case 1:
                        allTensorBuffers = _d.sent();
                        scoresBuffer = allTensorBuffers[0];
                        offsetsBuffer = allTensorBuffers[1];
                        displacementsFwdBuffer = allTensorBuffers[2];
                        displacementsBwdBuffer = allTensorBuffers[3];
                        return [4, decode_multiple_poses_1.decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, configWithDefaults.maxDetections, configWithDefaults.scoreThreshold, configWithDefaults.nmsRadius)];
                    case 2:
                        poses = _d.sent();
                        resultPoses = util_1.scaleAndFlipPoses(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
                        heatmapScores.dispose();
                        offsets.dispose();
                        displacementFwd.dispose();
                        displacementBwd.dispose();
                        resized.dispose();
                        return [2, resultPoses];
                }
            });
        });
    };
    PoseNet.prototype.estimateSinglePose = function (input, config) {
        if (config === void 0) { config = exports.SINGLE_PERSON_INFERENCE_CONFIG; }
        return __awaiter(this, void 0, void 0, function () {
            var configWithDefaults, outputStride, inputResolution, _a, height, width, _b, resized, padding, _c, heatmapScores, offsets, displacementFwd, displacementBwd, pose, poses, resultPoses;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        configWithDefaults = __assign({}, exports.SINGLE_PERSON_INFERENCE_CONFIG, config);
                        validateSinglePersonInferenceConfig(configWithDefaults);
                        outputStride = this.baseModel.outputStride;
                        inputResolution = this.inputResolution;
                        _a = util_1.getInputTensorDimensions(input), height = _a[0], width = _a[1];
                        _b = util_1.padAndResizeTo(input, inputResolution), resized = _b.resized, padding = _b.padding;
                        _c = this.baseModel.predict(resized), heatmapScores = _c.heatmapScores, offsets = _c.offsets, displacementFwd = _c.displacementFwd, displacementBwd = _c.displacementBwd;
                        return [4, decode_single_pose_1.decodeSinglePose(heatmapScores, offsets, outputStride)];
                    case 1:
                        pose = _d.sent();
                        poses = [pose];
                        resultPoses = util_1.scaleAndFlipPoses(poses, [height, width], inputResolution, padding, configWithDefaults.flipHorizontal);
                        heatmapScores.dispose();
                        offsets.dispose();
                        displacementFwd.dispose();
                        displacementBwd.dispose();
                        resized.dispose();
                        return [2, resultPoses[0]];
                }
            });
        });
    };
    PoseNet.prototype.estimatePoses = function (input, config) {
        return __awaiter(this, void 0, void 0, function () {
            var pose;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(config.decodingMethod === 'single-person')) return [3, 2];
                        return [4, this.estimateSinglePose(input, config)];
                    case 1:
                        pose = _a.sent();
                        return [2, [pose]];
                    case 2: return [2, this.estimateMultiplePoses(input, config)];
                }
            });
        });
    };
    PoseNet.prototype.dispose = function () {
        this.baseModel.dispose();
    };
    return PoseNet;
}());
exports.PoseNet = PoseNet;
function loadMobileNet(config) {
    return __awaiter(this, void 0, void 0, function () {
        var outputStride, quantBytes, multiplier, url, graphModel, mobilenet, validInputResolution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputStride = config.outputStride;
                    quantBytes = config.quantBytes;
                    multiplier = config.multiplier;
                    if (tf == null) {
                        throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please " +
                            "also include @tensorflow/tfjs on the page before using this\n        model.");
                    }
                    url = checkpoints_1.mobileNetCheckpoint(outputStride, multiplier, quantBytes);
                    return [4, tfconv.loadGraphModel(config.modelUrl || url)];
                case 1:
                    graphModel = _a.sent();
                    mobilenet = new mobilenet_1.MobileNet(graphModel, outputStride);
                    validInputResolution = util_1.getValidInputResolutionDimensions(config.inputResolution, mobilenet.outputStride);
                    return [2, new PoseNet(mobilenet, validInputResolution)];
            }
        });
    });
}
function loadResNet(config) {
    return __awaiter(this, void 0, void 0, function () {
        var outputStride, quantBytes, url, graphModel, resnet, validInputResolution;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputStride = config.outputStride;
                    quantBytes = config.quantBytes;
                    if (tf == null) {
                        throw new Error("Cannot find TensorFlow.js. If you are using a <script> tag, please " +
                            "also include @tensorflow/tfjs on the page before using this\n        model.");
                    }
                    url = checkpoints_1.resNet50Checkpoint(outputStride, quantBytes);
                    return [4, tfconv.loadGraphModel(config.modelUrl || url)];
                case 1:
                    graphModel = _a.sent();
                    resnet = new resnet_1.ResNet(graphModel, outputStride);
                    validInputResolution = util_1.getValidInputResolutionDimensions(config.inputResolution, resnet.outputStride);
                    return [2, new PoseNet(resnet, validInputResolution)];
            }
        });
    });
}
function load(config) {
    if (config === void 0) { config = MOBILENET_V1_CONFIG; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            config = validateModelConfig(config);
            if (config.architecture === 'ResNet50') {
                return [2, loadResNet(config)];
            }
            else if (config.architecture === 'MobileNetV1') {
                return [2, loadMobileNet(config)];
            }
            else {
                return [2, null];
            }
            return [2];
        });
    });
}
exports.load = load;
//# sourceMappingURL=posenet_model.js.map
}, function(modId) { var map = {"./checkpoints":1606226927275,"./mobilenet":1606226927263,"./multi_pose/decode_multiple_poses":1606226927265,"./resnet":1606226927276,"./single_pose/decode_single_pose":1606226927271,"./util":1606226927277}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927275, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var MOBILENET_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/mobilenet/';
var RESNET50_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/';
function resNet50Checkpoint(stride, quantBytes) {
    var graphJson = "model-stride" + stride + ".json";
    if (quantBytes === 4) {
        return RESNET50_BASE_URL + "float/" + graphJson;
    }
    else {
        return RESNET50_BASE_URL + ("quant" + quantBytes + "/") + graphJson;
    }
}
exports.resNet50Checkpoint = resNet50Checkpoint;
function mobileNetCheckpoint(stride, multiplier, quantBytes) {
    var toStr = { 1.0: '100', 0.75: '075', 0.50: '050' };
    var graphJson = "model-stride" + stride + ".json";
    if (quantBytes === 4) {
        return MOBILENET_BASE_URL + ("float/" + toStr[multiplier] + "/") + graphJson;
    }
    else {
        return MOBILENET_BASE_URL + ("quant" + quantBytes + "/" + toStr[multiplier] + "/") +
            graphJson;
    }
}
exports.mobileNetCheckpoint = mobileNetCheckpoint;
//# sourceMappingURL=checkpoints.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927276, function(require, module, exports) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var base_model_1 = require("./base_model");
var imageNetMean = [-123.15, -115.90, -103.06];
var ResNet = (function (_super) {
    __extends(ResNet, _super);
    function ResNet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResNet.prototype.preprocessInput = function (input) {
        return input.add(imageNetMean);
    };
    ResNet.prototype.nameOutputResults = function (results) {
        var displacementFwd = results[0], displacementBwd = results[1], offsets = results[2], heatmap = results[3];
        return { offsets: offsets, heatmap: heatmap, displacementFwd: displacementFwd, displacementBwd: displacementBwd };
    };
    return ResNet;
}(base_model_1.BaseModel));
exports.ResNet = ResNet;
//# sourceMappingURL=resnet.js.map
}, function(modId) { var map = {"./base_model":1606226927264}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927277, function(require, module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-core");
var keypoints_1 = require("./keypoints");
function eitherPointDoesntMeetConfidence(a, b, minConfidence) {
    return (a < minConfidence || b < minConfidence);
}
function getAdjacentKeyPoints(keypoints, minConfidence) {
    return keypoints_1.connectedPartIndices.reduce(function (result, _a) {
        var leftJoint = _a[0], rightJoint = _a[1];
        if (eitherPointDoesntMeetConfidence(keypoints[leftJoint].score, keypoints[rightJoint].score, minConfidence)) {
            return result;
        }
        result.push([keypoints[leftJoint], keypoints[rightJoint]]);
        return result;
    }, []);
}
exports.getAdjacentKeyPoints = getAdjacentKeyPoints;
var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY, POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
function getBoundingBox(keypoints) {
    return keypoints.reduce(function (_a, _b) {
        var maxX = _a.maxX, maxY = _a.maxY, minX = _a.minX, minY = _a.minY;
        var _c = _b.position, x = _c.x, y = _c.y;
        return {
            maxX: Math.max(maxX, x),
            maxY: Math.max(maxY, y),
            minX: Math.min(minX, x),
            minY: Math.min(minY, y)
        };
    }, {
        maxX: NEGATIVE_INFINITY,
        maxY: NEGATIVE_INFINITY,
        minX: POSITIVE_INFINITY,
        minY: POSITIVE_INFINITY
    });
}
exports.getBoundingBox = getBoundingBox;
function getBoundingBoxPoints(keypoints) {
    var _a = getBoundingBox(keypoints), minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
    return [
        { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY },
        { x: minX, y: maxY }
    ];
}
exports.getBoundingBoxPoints = getBoundingBoxPoints;
function toTensorBuffers3D(tensors) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, Promise.all(tensors.map(function (tensor) { return tensor.buffer(); }))];
        });
    });
}
exports.toTensorBuffers3D = toTensorBuffers3D;
function scalePose(pose, scaleY, scaleX, offsetY, offsetX) {
    if (offsetY === void 0) { offsetY = 0; }
    if (offsetX === void 0) { offsetX = 0; }
    return {
        score: pose.score,
        keypoints: pose.keypoints.map(function (_a) {
            var score = _a.score, part = _a.part, position = _a.position;
            return ({
                score: score,
                part: part,
                position: {
                    x: position.x * scaleX + offsetX,
                    y: position.y * scaleY + offsetY
                }
            });
        })
    };
}
exports.scalePose = scalePose;
function scalePoses(poses, scaleY, scaleX, offsetY, offsetX) {
    if (offsetY === void 0) { offsetY = 0; }
    if (offsetX === void 0) { offsetX = 0; }
    if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
        return poses;
    }
    return poses.map(function (pose) { return scalePose(pose, scaleY, scaleX, offsetY, offsetX); });
}
exports.scalePoses = scalePoses;
function flipPoseHorizontal(pose, imageWidth) {
    return {
        score: pose.score,
        keypoints: pose.keypoints.map(function (_a) {
            var score = _a.score, part = _a.part, position = _a.position;
            return ({
                score: score,
                part: part,
                position: { x: imageWidth - 1 - position.x, y: position.y }
            });
        })
    };
}
exports.flipPoseHorizontal = flipPoseHorizontal;
function flipPosesHorizontal(poses, imageWidth) {
    if (imageWidth <= 0) {
        return poses;
    }
    return poses.map(function (pose) { return flipPoseHorizontal(pose, imageWidth); });
}
exports.flipPosesHorizontal = flipPosesHorizontal;
function toValidInputResolution(inputResolution, outputStride) {
    if (isValidInputResolution(inputResolution, outputStride)) {
        return inputResolution;
    }
    return Math.floor(inputResolution / outputStride) * outputStride + 1;
}
exports.toValidInputResolution = toValidInputResolution;
function validateInputResolution(inputResolution) {
    tf.util.assert(typeof inputResolution === 'number' ||
        typeof inputResolution === 'object', function () { return "Invalid inputResolution " + inputResolution + ". " +
        "Should be a number or an object with width and height"; });
    if (typeof inputResolution === 'object') {
        tf.util.assert(typeof inputResolution.width === 'number', function () { return "inputResolution.width has a value of " + inputResolution.width + " which is invalid; it must be a number"; });
        tf.util.assert(typeof inputResolution.height === 'number', function () { return "inputResolution.height has a value of " + inputResolution.height + " which is invalid; it must be a number"; });
    }
}
exports.validateInputResolution = validateInputResolution;
function getValidInputResolutionDimensions(inputResolution, outputStride) {
    validateInputResolution(inputResolution);
    if (typeof inputResolution === 'object') {
        return [
            toValidInputResolution(inputResolution.height, outputStride),
            toValidInputResolution(inputResolution.width, outputStride),
        ];
    }
    else {
        return [
            toValidInputResolution(inputResolution, outputStride),
            toValidInputResolution(inputResolution, outputStride),
        ];
    }
}
exports.getValidInputResolutionDimensions = getValidInputResolutionDimensions;
var VALID_OUTPUT_STRIDES = [8, 16, 32];
function assertValidOutputStride(outputStride) {
    tf.util.assert(typeof outputStride === 'number', function () { return 'outputStride is not a number'; });
    tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, function () { return "outputStride of " + outputStride + " is invalid. " +
        "It must be either 8, 16, or 32"; });
}
exports.assertValidOutputStride = assertValidOutputStride;
function isValidInputResolution(resolution, outputStride) {
    return (resolution - 1) % outputStride === 0;
}
function assertValidResolution(resolution, outputStride) {
    tf.util.assert(typeof resolution[0] === 'number' && typeof resolution[1] === 'number', function () { return "both resolution values must be a number but had values " + resolution; });
    tf.util.assert(isValidInputResolution(resolution[0], outputStride), function () { return "height of " + resolution[0] + " is invalid for output stride " +
        (outputStride + "."); });
    tf.util.assert(isValidInputResolution(resolution[1], outputStride), function () { return "width of " + resolution[1] + " is invalid for output stride " +
        (outputStride + "."); });
}
exports.assertValidResolution = assertValidResolution;
function getInputTensorDimensions(input) {
    return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
        [input.height, input.width];
}
exports.getInputTensorDimensions = getInputTensorDimensions;
function toInputTensor(input) {
    return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
}
exports.toInputTensor = toInputTensor;
function toResizedInputTensor(input, resizeHeight, resizeWidth, flipHorizontal) {
    return tf.tidy(function () {
        var imageTensor = toInputTensor(input);
        if (flipHorizontal) {
            return imageTensor.reverse(1).resizeBilinear([resizeHeight, resizeWidth]);
        }
        else {
            return imageTensor.resizeBilinear([resizeHeight, resizeWidth]);
        }
    });
}
exports.toResizedInputTensor = toResizedInputTensor;
function padAndResizeTo(input, _a) {
    var targetH = _a[0], targetW = _a[1];
    var _b = getInputTensorDimensions(input), height = _b[0], width = _b[1];
    var targetAspect = targetW / targetH;
    var aspect = width / height;
    var _c = [0, 0, 0, 0], padT = _c[0], padB = _c[1], padL = _c[2], padR = _c[3];
    if (aspect < targetAspect) {
        padT = 0;
        padB = 0;
        padL = Math.round(0.5 * (targetAspect * height - width));
        padR = Math.round(0.5 * (targetAspect * height - width));
    }
    else {
        padT = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
        padB = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
        padL = 0;
        padR = 0;
    }
    var resized = tf.tidy(function () {
        var imageTensor = toInputTensor(input);
        imageTensor = tf.pad3d(imageTensor, [[padT, padB], [padL, padR], [0, 0]]);
        return imageTensor.resizeBilinear([targetH, targetW]);
    });
    return { resized: resized, padding: { top: padT, left: padL, right: padR, bottom: padB } };
}
exports.padAndResizeTo = padAndResizeTo;
function scaleAndFlipPoses(poses, _a, _b, padding, flipHorizontal) {
    var height = _a[0], width = _a[1];
    var inputResolutionHeight = _b[0], inputResolutionWidth = _b[1];
    var scaleY = (height + padding.top + padding.bottom) / (inputResolutionHeight);
    var scaleX = (width + padding.left + padding.right) / (inputResolutionWidth);
    var scaledPoses = scalePoses(poses, scaleY, scaleX, -padding.top, -padding.left);
    if (flipHorizontal) {
        return flipPosesHorizontal(scaledPoses, width);
    }
    else {
        return scaledPoses;
    }
}
exports.scaleAndFlipPoses = scaleAndFlipPoses;
//# sourceMappingURL=util.js.map
}, function(modId) { var map = {"./keypoints":1606226927269}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1606226927278, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var version = '2.2.1';
exports.version = version;
//# sourceMappingURL=version.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1606226927262);
})()
//# sourceMappingURL=index.js.map