# Spike: On-device ML framework for vehicle photo recognition

## Decision needed
Which on-device ML framework to use for `PhotoRecognitionScreen`.

## Options

| Framework | iOS | Android | Model format | Bundle size | Inference time |
|---|---|---|---|---|---|
| **Core ML** | Native, best performance | ✗ (iOS only) | `.mlmodel` / `.mlpackage` | ~0 overhead | < 100 ms on A-series |
| **TensorFlow Lite** | ✅ (via delegate) | ✅ Native | `.tflite` | ~2 MB runtime | 100–300 ms |
| **ONNX Runtime Mobile** | ✅ | ✅ | `.onnx` | ~4 MB runtime | 150–400 ms |
| **React Native PyTorch** | ✅ | ✅ | PyTorch Mobile | ~8 MB runtime | 200–500 ms |

## Recommendation
**TensorFlow Lite** with a MobileNetV3 / EfficientNet-Lite backbone:
- Cross-platform (single code path for iOS + Android)
- Good Expo/React Native community support via `@tensorflow/tfjs-react-native`
- The [`expo-tflite`](https://github.com/mybigday/expo-tflite) package provides a clean native bridge
- Model size for a car-make/model classifier: ~8–15 MB (acceptable for offline bundle)
- Inference time < 300 ms on mid-range devices

## Spike tasks
1. [ ] Train / fine-tune MobileNetV3-Small on Stanford Cars + VMMRdb dataset
2. [ ] Export to TFLite with 8-bit quantisation
3. [ ] Benchmark on iPhone 12 and Pixel 6
4. [ ] Integrate via `expo-tflite` in `PhotoRecognitionScreen.ts` by replacing `runVehicleClassifier` stub
5. [ ] Validate confidence thresholds on holdout set (target: top-1 ≥ 85% for vehicles in DB)

## Model interface contract (already wired in app)
```typescript
interface ClassificationResult {
  make: string;
  model: string;
  yearMin: number;
  yearMax: number;
  confidence: number; // 0–1
  vehicleId?: string; // matches VEHICLES[].id
}
async function runVehicleClassifier(imageUri: string): Promise<ClassificationResult[]>
```
The rest of `PhotoRecognitionScreen` does not need to change.
